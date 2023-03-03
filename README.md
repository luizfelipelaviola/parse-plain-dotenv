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
      contents: read
      id-token: write

    steps:
      - name: Checkout to branch
        uses: actions/checkout@v3
        
      - name: Google auth
        id: auth
        uses: google-github-actions/auth@v1
        with:
          workload_identity_provider: projects/123456789/locations/global/workloadIdentityPools/my-pool/providers/my-provider
          service_account: my-service-account@my-project.iam.gserviceaccount.com

      - name: Get env from Google Secret Manager
        id: secrets
        uses: google-github-actions/get-secretmanager-secrets@v1
        with:
          secrets: |-
            env-variables:my-project/my-secret-manager-env-name

      - name: Parse dotenv to .env file and set to build environment variables
        uses: luizfelipelaviola/parse-plain-dotenv@v1
        with:
          data: ${{ steps.secrets.outputs.env-variables }}
          parse-env: true
          write-env-file: true

      # Example of using the environment variables
      - name: Deploy
        id: publish
        uses: foo/bar@main
        env:
          SOMETHING: ${{ env.something }}
```

## Prerequisites

- This action runs using Node 16. If you are using self-hosted GitHub Actions runners, you must use runner version [2.285.0](https://github.com/actions/virtual-environments) or newer.

## Inputs

| Property | Is Required | Default | Comment | Example |
|----------|-------------|---------|---------|---------|
| data     | x           |         | the doenv syntax string to be parsed | SOME_VARIABLE=some-string ANOTHER_VARIABLE=another-string |
| parse-env |            | true    | sets whether the action should pass the content to build environment |  |
| write-env-file |       | false   | sets whether the action should write a .env file with the content    |  |
| env-file-path |        | .env    | sets the path of the .env file to be written | src/.env.something |

## Notes

🚨 This action may expose your secrets to the public. Be careful when using it.

This action was inspired by [dotenv github action](https://github.com/xom9ikk/dotenv) and [google-github-actions/get-secretmanager-secrets](https://github.com/google-github-actions/get-secretmanager-secrets).

Made with ❤ by [Luiz Felipe Laviola](https://www.linkedin.com/in/luizfelipelaviola/)
