# parse-plain-dotenv

This action receives a dotenv syntax string and parse it into the Github environment.

## Motivation

On projects that requires too many environment variables at runtime or compilation time, it's a good practice to use a dotenv file to store them.

However, Github Actions doesn't support dotenv files. Also, creating secrets or repository variables entries for each required .env variable is a tedious task.

This action was designed thinking on a different use of the Google Secret Manager: instead of creating a secret for each environment variable, create a single secret with the entire dotenv file with correct syntax and use this action to parse it into the Github environment.

## Usage

```yaml
jobs:
  job_id:
    permissions:
      contents: 'read'
      id-token: 'write'

    steps:
    - id: 'auth'
      uses: 'google-github-actions/auth@v1'
      with:
        workload_identity_provider: 'projects/123456789/locations/global/workloadIdentityPools/my-pool/providers/my-provider'
        service_account: 'my-service-account@my-project.iam.gserviceaccount.com'

    - id: 'secrets'
      uses: 'google-github-actions/get-secretmanager-secrets@v1'
      with:
        secrets: |-
          env-variables:my-project/docker-registry-env-variables

    - id: 'parse'
      uses: 'luizfelipelaviola/parse-plain-dotenv@v1'
      with:
        data: '${{ steps.secrets.outputs.env-variables }}'

    # Example of using the output
    - id: 'publish'
      uses: 'foo/bar@main'
      env:
        TOKEN: '${{ env.token }}'
```

## Prerequisites

- This action runs using Node 16. If you are using self-hosted GitHub Actions runners, you must use runner version [2.285.0](https://github.com/actions/virtual-environments) or newer.

## Inputs

- `data`: The dotenv syntax string to be parsed.

## Notes

This action was inspired by [dotenv github action](https://github.com/xom9ikk/dotenv) and [google-github-actions/get-secretmanager-secrets](https://github.com/google-github-actions/get-secretmanager-secrets).

Made with ❤ by [Luiz Felipe Laviola](https://www.linkedin.com/in/luizfelipelaviola/)
