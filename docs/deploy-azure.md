# Deploying AI Ignite to Azure with Terraform

> **This is not the current deployment path. Vercel is — see
> [`docs/deploy.md`](./deploy.md).**
>
> Nothing in this runbook has ever been applied. There is no Azure
> subscription behind it, no Terraform state, and no `.tf` file in this
> repository. It is kept, and kept accurate, for two reasons: the
> research in it is real and would be tedious to redo, and it is the
> written argument for why this site can be hosted for nothing on any
> static host at all — which is a property worth not losing track of.
>
> One thing here is load-bearing TODAY, on Vercel:
> `final/public/staticwebapp.config.json` is the Azure Static Web Apps
> config named in section 0. It is inert on Vercel, which never reads
> it, and it is deliberately still in the tree so this path stays
> one command from working. Its security headers are duplicated in
> `final/vercel.json`, which is the file that actually applies them
> today. **Change one and change the other**, or the two hosts serve
> different headers.
>
> If Azure is ever chosen, this is the document; delete `vercel.json`
> and the Vercel project, and follow it from section 0.

A hands-on runbook. You run every command; nothing here has been applied to
your subscription. Where a step has a trap in it, the trap is written down
next to the step rather than left for you to hit.

Assumes the domain is already purchased.

---

## What you are building, and why it is shaped this way

```
   your registrar (DNS)                     Azure
   ─────────────────────                    ─────
   www  CNAME ──────────────────►  Static Web App (Free)
   @    redirect to www            ├── global CDN + free TLS cert
                                   └── content: final/out/
                                            ▲
   GitHub Actions ──── upload ─────────────┘
        (deployment token)

   Terraform owns the Azure boxes. It never uploads content.
```

**The site is static.** No route handlers, no middleware, no server actions,
no `cookies()`/`headers()`, no `next/image`, no dynamic routes. All six pages
are rendered at build time; the only thing running at request time is the heat
field, in the browser. That is the whole reason free hosting is a real option
here and not a compromise — there is no server to pay for.

**Azure Static Web Apps Free tier**, specifically:

| | Free tier |
|---|---|
| Price | $0, permanently — not a 12-month trial |
| Bandwidth | 100 GB / month |
| App size | 250 MB (this site is **3.9 MB**) |
| Custom domains | 2 |
| TLS certificate | Free, auto-renewed |
| SLA | None. It is a student club site; you do not need one. |

AWS has no single equivalent. S3 + CloudFront works, but S3's free storage
expires after 12 months and a custom domain needs Route 53 at $0.50/month, so
it stops being free and has four times the moving parts.

**Terraform owns infrastructure; GitHub Actions owns deploys.** The
`azurerm_static_web_app` resource *can* take `repository_url` and
`repository_token` and wire up CI for you — do not use it. It puts a GitHub PAT
in your Terraform state and makes `terraform apply` responsible for your
content pipeline. Keep the two jobs apart.

---

## 0. What is already done in this repo

Three changes are committed already, because they are required by *any* static
host, not just Azure:

- **`final/next.config.ts`** — `output: "export"` makes `next build` emit the
  whole site to `final/out/`. `trailingSlash: true` makes it emit
  `out/forge/index.html` rather than `out/forge.html`; both work on some hosts,
  only the directory form works on all of them, because every static server
  resolves a directory to its index.
- **`final/public/staticwebapp.config.json`** — Azure reads this from the root
  of the uploaded artifact. It routes 404s to `404.html`, marks the
  content-hashed `/_next/static/*` assets `immutable` for a year, and sets
  `Referrer-Policy: no-referrer`, which is what `app/privacy/page.tsx` already
  promises readers.
- **`final/.gitignore`** already has `/out/`. Build output is never committed.

Verified locally: `npm run build` produces `out/` at 3.9 MB, all six routes
return 200 from a plain static server, internal links carry trailing slashes,
and the page renders identically to `next dev`.

---

## 1. Preflight

```bash
terraform version     # you have 1.14.7
az version            # you have 2.84.0
node -v               # Next 16 needs >= 20.9.0; you have 20.20.0
az account show       # you are on "Azure for Students"
```

Confirm your identity can create things. You need Contributor or Owner **on
the subscription**, not just on one resource group, because step 4 creates a
resource group:

```bash
az role assignment list \
  --assignee "$(az account show --query user.name -o tsv)" \
  --query "[].{role:roleDefinitionName, scope:scope}" -o table
```

Confirm the resource providers are registered (all three already are on your
subscription; this is here for when you do it on a different one):

```bash
for p in Microsoft.Web Microsoft.Storage Microsoft.Network; do
  echo -n "$p: "; az provider show -n $p --query registrationState -o tsv
done
```

If any says `NotRegistered`: `az provider register -n Microsoft.Web --wait`.

---

## 2. The domain: decide where DNS lives

This is the one real decision in the whole exercise, and it is the only place
money can leak in.

|  | Registrar DNS | Azure DNS |
|---|---|---|
| Cost | $0 | **~$0.50/month per zone** + query charges |
| Managed by | Clicking in your registrar's panel | Terraform |
| Apex domain | Depends on registrar support | Clean |

**Take registrar DNS.** You said this has to be free, and an Azure DNS zone is
the one component here that isn't. You lose the satisfaction of having DNS in
Terraform; you keep $6/year and one fewer thing to destroy.

Everything below assumes registrar DNS. Section 7 covers the apex question,
which is where registrar DNS actually costs you something.

---

## 3. Bootstrap the Terraform state backend

State holds your deployment token in plaintext, so it never goes in git. It
goes in Azure Storage.

There is a chicken-and-egg here worth naming: **Terraform cannot create its own
backend.** The backend must exist before `terraform init` can talk to it. So
this one piece is created with the CLI by hand, once, and never touched again.
This mirrors the `yorkpulse-terraform` / `yorkpulsetfstate` pattern already on
your subscription.

```bash
az group create --name aiignite-terraform --location canadacentral

az storage account create \
  --name aiignitetfstate \
  --resource-group aiignite-terraform \
  --location canadacentral \
  --sku Standard_LRS \
  --kind StorageV2 \
  --min-tls-version TLS1_2 \
  --allow-blob-public-access false

az storage container create \
  --name tfstate \
  --account-name aiignitetfstate \
  --auth-mode login
```

Storage account names are globally unique, lowercase, 3–24 chars, no hyphens.
If `aiignitetfstate` is taken, pick another and change it in `backend.tf` too.

> **If you get `The specified account is disabled`** — that is what your
> existing `yorkpulsetfstate` account currently returns. Student subscriptions
> disable storage accounts when the credit runs out or the subscription is
> suspended. Check `az account show --query state` before assuming you typed
> something wrong.

**Strictly-$0 alternative:** HCP Terraform's free tier gives you remote state
for up to 5 users at no cost. The storage account above costs roughly a cent a
month, which is not zero. Your call; the storage account keeps everything in
one cloud.

---

## 4. Write the Terraform

Create `infra/` at the repo root — beside `final/`, not inside it. The Next app
should not have infrastructure in its build context.

```
aiignite/
├── final/          the site
└── infra/          this section
    ├── backend.tf
    ├── main.tf
    ├── variables.tf
    ├── outputs.tf
    └── terraform.tfvars      (gitignored — holds your subscription id)
```

### `infra/backend.tf`

```hcl
terraform {
  required_version = ">= 1.9"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }

  # Created by hand in section 3. Terraform cannot create its own backend.
  backend "azurerm" {
    resource_group_name  = "aiignite-terraform"
    storage_account_name = "aiignitetfstate"
    container_name       = "tfstate"
    key                  = "prod.tfstate"
    use_azuread_auth     = true
  }
}

provider "azurerm" {
  features {}

  # REQUIRED in azurerm 4.x. Version 3 inferred this from the az CLI's active
  # subscription; 4 refuses to guess, and the error you get if you omit it
  # ("subscription_id is required") is thrown at plan time, not init time.
  subscription_id = var.subscription_id
}
```

### `infra/variables.tf`

```hcl
variable "subscription_id" {
  description = "Azure subscription the site lives in."
  type        = string
}

variable "domain" {
  description = "Apex domain, no scheme and no www. Example: aiignite.ca"
  type        = string
}

variable "location" {
  description = <<-EOT
    Where the Static Web App RESOURCE lives. Azure only offers five regions
    for this resource type — Central US, East US 2, West US 2, West Europe,
    East Asia. There is no Canadian one, and it does not matter: this is
    where the control-plane metadata sits, not where your visitors are
    served from. Content goes out over a global CDN either way.
  EOT
  type        = string
  default     = "eastus2"
}
```

### `infra/main.tf`

```hcl
resource "azurerm_resource_group" "site" {
  # The resource group's own location is metadata. It does not have to match,
  # and cannot always match, the resources inside it.
  name     = "aiignite"
  location = "canadacentral"
}

resource "azurerm_static_web_app" "site" {
  name                = "aiignite"
  resource_group_name = azurerm_resource_group.site.name
  location            = var.location

  sku_tier = "Free"
  sku_size = "Free"

  # Deliberately NOT setting repository_url / repository_token. See the note
  # at the top: Terraform owns infrastructure, GitHub Actions owns deploys.
  # Setting them here would put a GitHub PAT in state and hand your content
  # pipeline to `terraform apply`.

  tags = {
    project = "aiignite"
    managed = "terraform"
  }
}
```

### `infra/outputs.tf`

```hcl
output "default_host_name" {
  description = "The azurestaticapps.net hostname. This is live the moment the app exists."
  value       = azurerm_static_web_app.site.default_host_name
}

output "deployment_token" {
  description = "Upload credential for the SWA CLI and GitHub Actions."
  value       = azurerm_static_web_app.site.api_key
  sensitive   = true
}
```

### `infra/terraform.tfvars`

```hcl
subscription_id = "fb7e60ee-c894-41ae-bbc3-2e6992fbb382"
domain          = "your-domain.ca"
```

Add to the root `.gitignore`:

```
infra/.terraform/
infra/*.tfstate
infra/*.tfstate.*
infra/terraform.tfvars
```

**`infra/.terraform.lock.hcl` is not on that list, and that is deliberate.**
Commit it. It pins the exact provider versions and their checksums, so CI and
your laptop resolve identically instead of silently drifting a minor version
apart. It is the single most commonly mis-ignored file in a Terraform repo.

`terraform.tfvars` **is** ignored — not because a subscription id is a
credential (it isn't), but because tfvars is where the first real secret will
land the day you add one, and a file's habits are set by what you did on day
one.

---

## 5. First apply

```bash
cd infra
terraform init      # downloads azurerm ~> 4.0, connects to the blob backend
terraform fmt       # canonical formatting; run it before every commit
terraform validate  # syntax and type checking, no cloud calls
terraform plan -out=tfplan
```

Read the plan. It should be exactly **2 to add, 0 to change, 0 to destroy** —
a resource group and a static web app. If it wants to destroy anything, stop.

```bash
terraform apply tfplan
terraform output default_host_name
```

Open that hostname. You get Azure's placeholder page, because the app exists
and has no content. That is the correct state after this step.

---

## 6. Build and deploy the content

```bash
cd ../final
npm ci
npm run build        # emits final/out/
```

Sanity-check the output before uploading:

```bash
ls out/index.html out/forge/index.html out/404.html out/staticwebapp.config.json
du -sh out           # expect ~3.9M, well under the 250 MB tier limit
```

Deploy:

```bash
npx @azure/static-web-apps-cli deploy ./out \
  --deployment-token "$(terraform -chdir=../infra output -raw deployment_token)" \
  --env production
```

`--env production` matters. Without it you get a **preview environment** on a
different hostname, and you will spend twenty minutes wondering why the real
URL is unchanged.

Reload the hostname. The site is live.

---

## 7. Point the domain at it

### 7a. `www` — the straightforward half

At your registrar, add:

| Type | Name | Value | TTL |
|---|---|---|---|
| CNAME | `www` | *(the `default_host_name` output)* | 3600 |

Wait for it to propagate, and **verify before applying Terraform** — the
Azure resource validates the CNAME at creation time and fails if it isn't
there yet:

```bash
dig +short www.your-domain.ca CNAME
```

Then add to `infra/main.tf`:

```hcl
resource "azurerm_static_web_app_custom_domain" "www" {
  static_web_app_id = azurerm_static_web_app.site.id
  domain_name       = "www.${var.domain}"

  # Azure proves you own the name by checking the CNAME you just created
  # actually points at this app. Nothing else to do.
  validation_type = "cname-delegation"
}
```

```bash
terraform apply
```

Certificate issuance takes a few minutes. `https://www.your-domain.ca` then
works, with auto-renewal you never think about again.

### 7b. The apex — read this before you start

The apex (`your-domain.ca`, no `www`) is genuinely harder, and the difficulty
is inherent to DNS rather than to Azure: **CNAME is illegal at the apex**, so
there is nothing to point at a hostname that might change IPs.

Azure's answer is TXT-token validation, and it has a real trap in it:

```hcl
resource "azurerm_static_web_app_custom_domain" "apex" {
  static_web_app_id = azurerm_static_web_app.site.id
  domain_name       = var.domain
  validation_type   = "dns-txt-token"
}
```

Azure hands back a validation token, then **blocks until a TXT record
containing that token exists** at `_dnsauth.your-domain.ca`. Terraform is
sitting inside that block, so `terraform output validation_token` cannot
return it — the apply hasn't finished. You cannot resolve it from one terminal.

Two ways through:

**Two terminals.** Start `terraform apply` and leave it running. In a second
terminal, read the token straight from Azure:

```bash
az staticwebapp hostname show \
  --name aiignite --resource-group aiignite \
  --hostname your-domain.ca \
  --query validationToken -o tsv
```

Add it at the registrar as `TXT  _dnsauth  <token>`, then an `A` record for
`@` pointing at the app. The first apply unblocks and completes.

**Or skip the apex entirely — recommended.** Set a redirect at your registrar:
`your-domain.ca → https://www.your-domain.ca`. Nearly every registrar offers
this free as "domain forwarding" or "URL redirect". You bind one hostname in
Azure instead of two, `www` is your canonical host, and both addresses work.
The cost is a redirect hop on the apex, which nobody will notice.

Take the redirect. Come back to 7b when the site matters enough to care.

---

## 8. Verify

```bash
# every route, over HTTPS, on the real domain
for p in / /forge/ /spark/ /privacy/ /terms/; do
  echo -n "$p "; curl -s -o /dev/null -w "%{http_code}\n" "https://www.your-domain.ca$p"
done

# 404 handling
curl -s -o /dev/null -w "%{http_code}\n" https://www.your-domain.ca/nope/   # expect 404

# the immutable cache header from staticwebapp.config.json
curl -sI https://www.your-domain.ca/_next/static/chunks/ | grep -i cache-control

# certificate
curl -sI https://www.your-domain.ca | head -1
```

Then open it in a browser and check the things curl cannot see: the intro
plays, the flame lands in the nav, the heat field responds to the pointer, and
the hero marks warm as you move across them.

Test on a phone too. The intro is 1 MB of video before anything else paints.

---

## 9. CI: deploy on every push

`.github/workflows/deploy.yml`:

```yaml
name: Deploy site

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: final/package-lock.json

      - run: npm ci
        working-directory: final

      - run: npm run build
        working-directory: final

      - uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: upload
          app_location: final/out
          skip_app_build: true
          skip_api_build: true
```

`skip_app_build: true` is load-bearing. Without it the action tries to detect
and build the app itself, from a directory that is already built output, and
fails in a way whose error message points nowhere useful.

Add the secret once:

```bash
terraform -chdir=infra output -raw deployment_token
```

GitHub → repo → Settings → Secrets and variables → Actions → New repository
secret → name `AZURE_STATIC_WEB_APPS_API_TOKEN`.

Your `main` has no upstream yet (`git rev-parse --abbrev-ref @{u}` fails), so
push it before expecting CI to fire.

---

## 10. Cost and teardown

| Resource | Monthly |
|---|---|
| Static Web App (Free) | $0 |
| Storage account for tfstate | ~$0.01 |
| Registrar DNS | $0 |
| **Azure DNS zone**, if you take that path in section 2 | **$0.50 + queries** |

Watch the Free tier's real limits: 100 GB bandwidth/month and 250 MB app size.
At 3.9 MB per full load you would need roughly 25,000 cold visits a month to
approach the bandwidth cap. Do not add uncompressed video to `public/` without
re-checking that number.

Teardown, when the term ends:

```bash
terraform -chdir=infra destroy      # the site
az group delete --name aiignite-terraform --yes   # the state backend, last
```

Destroy in that order. Deleting the backend first orphans the state and leaves
you removing the static web app by hand.

---

## Troubleshooting

**`subscription_id is required`** — azurerm 4.x will not infer it from the az
CLI. It is in `backend.tf` above; make sure `terraform.tfvars` exists.

**`The specified account is disabled`** — the storage account, not your login.
Student subscriptions disable storage when credit runs out. `az account show
--query state`.

**Custom domain stuck on `Validating`** — DNS has not propagated to Azure's
resolvers yet, which is not the same as propagating to yours. Check with a
public resolver: `dig @8.8.8.8 +short www.your-domain.ca CNAME`.

**`/forge` 404s but `/forge/` works** — `trailingSlash: true` in
`next.config.ts` is what produces the directory form. It is already set; if you
remove it, this is the symptom.

**Deploy succeeded, site unchanged** — you deployed to a preview environment.
`--env production` on the SWA CLI.

**Site is live but the sign-up button opens a mail client** —
`NEXT_PUBLIC_SIGNUP_URL` is unset, so `lib/signup.ts` falls back to a prefilled
mailto and derives its microcopy from the same branch. That is deliberate, not
broken. It is inlined at build time, so set it and rebuild once the form
exists — a redeploy without a rebuild will not pick it up.
