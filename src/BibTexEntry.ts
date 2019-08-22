interface BibTexEntry {
  label: string,
  filterText?: string,
  data: {
    cite: string,
    entry: {
      title: string,
      label: string,
      properties: {
        title: string,
      }
    },
  }
}

export default BibTexEntry
