/*  Builds a query for pathways since lookup by ID doesn't return the datasets
    field, which we need in order to exclude non-reactome datasets. You can't
    really blame Reactome for not understanding Kegg pathway ids. */
export default function pathwayQuery(val, pathFormat) {
  return {
    "from": "Pathway",
    "select": [
      "identifier",
    ],
    "orderBy": [{
      "path": "identifier",
      "direction": "ASC"
    }],
    "where": [{
      "path": pathFormat,
      "op": "=",
      "value": val
    }, {
      "path": "dataSets.name",
      "op": "==",
      "value": "Reactome pathways data set"
    }]
  };
};
