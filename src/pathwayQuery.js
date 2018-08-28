export default pathwayQuery = {
  "from": "Pathway",
  "select": [
    "identifier",
    "name",
    "dataSets.name"
  ],
  "orderBy": [
    {
      "path": "identifier",
      "direction": "ASC"
    }
  ],
  "where": [
  {
    "path": "id",
    "op": "="
  }
]
};
