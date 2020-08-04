Setup OpenShift GitHub Action
===============================

[<img src="https://github.com/manusa/actions-setup-openshift/workflows/Main%20workflow/badge.svg" />](https://github.com/manusa/actions-setup-openshift/actions)

Set up your GitHub Actions workflow with a specific version of OKD ([OpenShift/Origin](https://github.com/openshift/origin)).

_Currently only Linux/Ubuntu
[CI environment](https://help.github.com/en/github/automating-your-workflow-with-github-actions/virtual-environments-for-github-actions)
is supported._

## Usage

### Basic

```yaml
name: Example workflow

on: [push]

jobs:
  example:
    name: Example OpenShift Cluster interaction
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v1
      - name: Setup OpenShift
        uses: manusa/actions-setup-openshift@v1.0.5
        with:
          oc version: 'v3.11.0'
          github token: ${{ secrets.GITHUB_TOKEN }}
      - name: Interact with the cluster
        run: oc cluster status
```

### Required input parameters

| Parameter | Description |
| --------- | ----------- |
| `oc version` | OpenShift [version](https://github.com/openshift/origin/releases) to deploy |

### Optional input parameters

| Parameter | Description |
| --------- | ----------- |
| `dns ip`  | External DNS server IP to use in node-config.yaml |
| `enable`  | A list of components to enable (comma separated) |
| `github token` | GITHUB_TOKEN secret value to access GitHub REST API with an unlimited number of requests |
## License

The scripts and documentation in this project are released under the [Apache 2.0](./LICENSE).
