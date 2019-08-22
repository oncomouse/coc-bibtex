interface BibTexEntry {
  label: string,
  filterText?: string,
  data: {
    cite: string,
    entry: {
      title: string,
      label: string,
    },
  }
}

export default BibTexEntry
