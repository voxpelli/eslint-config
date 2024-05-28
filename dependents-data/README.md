To find missing modules in workflow-external.json, run from top:

```sh
jd -set -color <(jq 'map(.) | flatten | sort' workflow-external.json) <(cat dependents-data/filtered.json)
```
