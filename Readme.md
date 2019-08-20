# coc-bibtex

This [Coc](https://github.com/neoclide/coc.nvim) extension adds a BibTeX source to CocList. You can access it by running `:CocList bibtex` in (Neo)Vim.

## Requirements

This extension uses the same [Go](https://golang.org/) binaries used in [fzf-bibtex](https://github.com/msprev/fzf-bibtex), so you will need a working install of [Go](https://golang.org/doc/install) to use this extension.

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

~~~
call coc#config('list.source.bibtex'. {
  \  'files': [
  \    '~/my-library.bib'
  \  ]
  \})
~~~

## Todo

* [] Add the ability to pass a `.bib` file as an argument to the list call
