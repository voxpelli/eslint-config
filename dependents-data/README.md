The files in this folder are not used directly but just used to help inform what modules that might be missing in `../workflow-external.json`.

To update + get a diff, run:

```sh
npm run dependents
jd -set -color <(jq 'map(.) | flatten | sort' workflow-external.json) <(cat dependents-data/filtered.json)
```
