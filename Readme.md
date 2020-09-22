# coc-bibtex

This [Coc](https://github.com/neoclide/coc.nvim) extension adds a BibTeX source to CocList. You can access it by running `:CocList bibtex` in (Neo)Vim. You can also use it as an autocompletion source for BibTeX entries.

## Installation

Run `:CocInstall coc-bibtex` to install.

## Configuration

Set `list.source.bibtex.files` to an array containing your `.bib` files. For instance, in `coc-settings.json`:

~~~json
{
// …
  "list": {
    "source": {
      "bibtex": {
        "files": [
          "~/my-library.bib"
        ]
      }
    }
  }
// …
}
~~~

Or in vimrc:

~~~vim
call coc#config('list.source.bibtex', {
  \  'files': [
  \    '~/my-library.bib'
  \  ]
  \})
~~~

### Using with LaTeX

LaTeX is support for both completion and list management

#### Completion

To trigger completion with a citation command in LaTeX, instead of the pandoc-style `@`, add the following to `coc-settings.json`:

~~~json
{
//...
  "coc.source.bibtex.triggerPatterns": ["\\\\cite\\{"],
  "coc.source.bibtex.triggerCharacters": []
}
~~~

This will also work for the `\cite{}` command. Changing `coc.source.bibtex.triggerPatterns` to `cite\\{` will work for any of the commands that end in `cite`, not just `\cite`.

#### List

The default configuration for the list source is to insert pandoc-style citations (`[@cite-key]`). If you would like to use this extension with LaTeX, add the following configuration:

In `coc-settings.json`:

~~~json
{
//...

"list.source.bibtex": {
    "citation": {
      "before": "\\cite{",
      "after": "}"
    }
  }
}
//...
}
~~~

## Useful Commands

`coc-bibtex` provides the following commands (which can be called as `:CocCommand <command name>` in Vim):

* `bibtex.reloadLibrary` – This will reload the library, updating the cache with any new changes.

## Todo

* [ ] Add the ability to pass a `.bib` file as an argument to the list call
* [ ] Color
