class BibtexParser {
  constructor () {
    this.pos = 0;
    this._input = '';

    this._entries = {};
    this.strings = {
      JAN: 'January',
      FEB: 'February',
      MAR: 'March',
      APR: 'April',
      MAY: 'May',
      JUN: 'June',
      JUL: 'July',
      AUG: 'August',
      SEP: 'September',
      OCT: 'October',
      NOV: 'November',
      DEC: 'December'
    };
    this.currentKey = '';
    this.rawCurrentKey = '';
    this.currentEntry = '';
  }

  set input (t) {
    this._input = t;
  }

  get entries () {
    return this._entries;
  }

  isWhitespace (s) {
    return (s === ' ' || s === '\r' || s === '\t' || s === '\n');
  }

  match (s) {
    this.skipWhitespace();
    if (this._input.substring(this.pos, this.pos + s.length) === s) {
      this.pos += s.length;
    } else {
      throw new Error('Token mismatch, expected ' + s + ', found ' + this._input.substring(this.pos));
    }
    this.skipWhitespace();
  }

  tryMatch (s) {
    this.skipWhitespace();
    if (this._input.substring(this.pos, this.pos + s.length) === s) {
      return true;
    } else {
      return false;
    }
    // this.skipWhitespace();
  }

  skipWhitespace () {
    while (this.isWhitespace(this._input[this.pos])) {
      this.pos++;
    }
    if (this._input[this.pos] === '%') {
      while (this._input[this.pos] !== '\n') {
        this.pos++;
      }
      this.skipWhitespace();
    }
  }

  value_braces () {
    var bracecount = 0;
    this.match('{');
    var start = this.pos;
    while (true) {
      if (this._input[this.pos] === '}' && this._input[this.pos - 1] !== '\\') {
        if (bracecount > 0) {
          bracecount--;
        } else {
          var end = this.pos;
          this.match('}');
          return this._input.substring(start, end);
        }
      } else if (this._input[this.pos] === '{') {
        bracecount++;
      } else if (this.pos === this._input.length - 1) {
        throw new Error('Unterminated value');
      }
      this.pos++;
    }
  }

  value_quotes () {
    var bracecount = 0;
    this.match('"');
    var start = this.pos;
    while (true) {
      if (this._input[this.pos] === '"' && this._input[this.pos - 1] !== '\\' && bracecount === 0) {
        var end = this.pos;
        this.match('"');
        return this._input.substring(start, end);
      } else if (this._input[this.pos] === '{') {
        bracecount++;
      } else if (this._input[this.pos] === '}') {
        if (bracecount > 0) {
          bracecount--;
        }
      } else if (this.pos === this._input.length - 1) {
        throw new Error('Unterminated value:' + this._input.substring(start));
      }
      this.pos++;
    }
  }

  single_value () {
    var start = this.pos;
    if (this.tryMatch('{')) {
      return this.value_braces();
    } else if (this.tryMatch('"')) {
      return this.value_quotes();
    } else {
      var k = this.key();
      if (this.strings[k.toUpperCase()]) {
        return this.strings[k];
      } else if (k.match('^[0-9]+$')) {
        return k;
      } else {
        throw new Error('Value expected:' + this._input.substring(start));
      }
    }
  }

  value () {
    var values = [];
    values.push(this.single_value());
    while (this.tryMatch('#')) {
      this.match('#');
      values.push(this.single_value());
    }
    return values.join('');
  }

  key () {
    var start = this.pos;
    while (true) {
      if (this.pos === this._input.length) {
        throw new Error('Runaway key');
      }

      if (this._input[this.pos].match("[a-zA-Z0-9_:?\\./'\\+\\-\\*]")) {
        this.pos++;
      } else {
        this.rawCurrentKey = this._input.substring(start, this.pos);
        return this.rawCurrentKey;
      }
    }
  }

  key_equals_value () {
    var key = this.key();
    if (this.tryMatch('=')) {
      this.match('=');
      var val = this.value();
      return [key, val];
    } else {
      throw new Error('... = value expected, equals sign missing:' + this._input.substring(this.pos));
    }
  }

  key_value_list () {
    var kv = this.key_equals_value();
    this._entries[this.currentEntry][kv[0]] = kv[1];
    while (this.tryMatch(',')) {
      this.match(',');
      // fixes problems with commas at the end of a list
      if (this.tryMatch('}') || this.tryMatch(')')) {
        break;
      }
      kv = this.key_equals_value();
      this._entries[this.currentEntry][kv[0]] = kv[1];
    }
  }

  entry_body (directive) {
    this.currentEntry = this.key();
    this._entries[this.currentEntry] = {};
    this._entries[this.currentEntry].BIBTEXKEY = this.rawCurrentKey;
    if (directive === '@INCOLLECTION') {
      this._entries[this.currentEntry].BIBTEXTYPE = 'book chapter';
    } else if (directive === '@INPROCEEDINGS') {
      this._entries[this.currentEntry].BIBTEXTYPE = 'conference, workshop';
    } else if (directive === '@ARTICLE') {
      this._entries[this.currentEntry].BIBTEXTYPE = 'journal';
    } else if (directive === '@TECHREPORT') {
      this._entries[this.currentEntry].BIBTEXTYPE = 'technical report';
    }
    this._entries[this.currentEntry].BIBTEXTYPEKEY = directive.substr(1);
    this.match(',');
    this.key_value_list();
  }

  directive () {
    this.match('@');
    return '@' + this.key();
  }

  string () {
    var kv = this.key_equals_value();
    this.strings[kv[0].toUpperCase()] = kv[1];
  }

  preamble () {
    this.value();
  }

  comment () {
    this.pos = this._input.indexOf('}', this.pos);
  }

  entry (directive) {
    this.entry_body(directive);
  }

  bibtex () {
    var start = 0;
    var end = 0;
    while (this.tryMatch('@')) {
      start = this.pos;
      var d = this.directive().toUpperCase();
      if (this.tryMatch('{')) {
        this.match('{');
      } else {
        this.match('(');
      }
      if (d === '@STRING') {
        this.string();
      } else if (d === '@PREAMBLE') {
        this.preamble();
      } else if (d === '@COMMENT') {
        this.comment();
      } else {
        this.entry(d);
      }
      end = this.pos + 1;
      if (this.tryMatch('}')) {
        this.match('}');
      } else {
        this.match(')');
      }
      if (this.tryMatch(',')) {
        this.match(',');
      }
      // In case there is extra stuff in between entries
      this.pos = end + this._input.substring(end, this._input.length).indexOf('@');
      this._entries[this.currentEntry].BIBTEXRAW = this._input.substring(start, end);
    }
  }
}
export default BibtexParser;
