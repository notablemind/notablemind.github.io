(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports={
  "simple": {
    "currentType": "local",
    "backs": {
      "local": {
        "shortname": "Local",
        "description": "Something descriptive",
        "icon": "computer"
      },
      "dropbox": {
        "shortname": "Dropbox",
        "description": "Something descriptive about db",
        "icon": "dropbox"
      }
    }
  },
  "_wrapState": {
    "prop": "currentType",
    "callback": "onSelect"
  },
  "_style": {
    "display": "block"
  }
}


},{}],2:[function(require,module,exports){
/** @jsx React.DOM */

var BackDrop = module.exports = React.createClass({
  displayName: 'BackDrop',
  mixins: [require('./pop-mix')],
  getDefaultProps: function () {
    return {
      backs: {},
      loading: false,
      currentType: '',
      onSelect: function (type) {
        console.log('selecting type', type)
      }
    }
  },
  cancelDown: function (e) {
    e.stopPropagation()
  },
  onSelect: function (type) {
    this.onHide()
    this.props.onSelect(type)
  },
  render: function () {
    if (this.props.loading) {
      return (
        React.DOM.div( {className:"back-drop back-drop--loading"}, 
          React.DOM.div( {className:"back-drop_loading"}, 
            "Connecting to ", this.props.loading,"..."
          )
        )
      )
    }
    var cls = 'back-drop'
    if (this.state.showing) {
      cls += ' back-drop--showing'
    }
    var backs = Object.keys(this.props.backs)
      , cur = this.props.backs[this.props.currentType] || {}
    return (
      React.DOM.div( {className:cls, onMouseDown:this.cancelDown}, 
        React.DOM.div( {className:"back-drop_current", onClick:this.onShow}, 
          React.DOM.i( {className:'fa fa-' + cur.icon}),
          React.DOM.span( {className:"back-drop_title"}, 
            cur.shortname
          )
        ),
        React.DOM.ul( {className:"back-drop_list"}, 
          
            backs.map(function (type) {
              if (type === this.props.currentType) return
              var back = this.props.backs[type]
              return (
                React.DOM.li( {className:"back-drop_choice",
                    key:type,
                    title:back.description,
                    onClick:this.onSelect.bind(null, type)}, 
                  React.DOM.i( {className:'fa fa-' + back.icon}),
                  React.DOM.span( {className:"back-drop_title"}, 
                    back.shortname
                  )
                )
              )
            }.bind(this))
          
        )
      )
    )
  }
})

// vim: set tabstop=2 shiftwidth=2 expandtab:


if (window.fusion) window.fusion.register(module.exports, "/Users/khanintern1/clone/notablemind/lib/back-drop.jsx", require("/Users/khanintern1/clone/notablemind/lib/back-drop.json"));
module.exports._file_origin = "/Users/khanintern1/clone/notablemind/lib/back-drop.jsx";
},{"./pop-mix":17,"/Users/khanintern1/clone/notablemind/lib/back-drop.json":1}],3:[function(require,module,exports){
module.exports={
  "simple": {
    "backs": {
      "local": {
        "shortname": "Local",
        "icon": "computer"
      },
      "dropbox": {
        "shortname": "Dropbox",
        "icon": "dropbox"
      }
    }
  },
  "_wrapState": {
    "prop": "currentType",
    "callback": "onSelect"
  }
}

},{}],4:[function(require,module,exports){
/** @jsx React.DOM */

var BackPick = module.exports = React.createClass({
  displayName: 'BackPick',
  render: function () {
    if (this.props.loading) {
      return (
        React.DOM.div( {className:"back-pick back-pick--loading"}, 
          React.DOM.div( {className:"back-pick_loading"}, 
            "Connecting to ", this.props.loading,"..."
          )
        )
      )
    }
    var backs = Object.keys(this.props.backs)
    return (
      React.DOM.div( {className:"back-pick"}, 
        
          backs.map(function (type) {
            var back = this.props.backs[type]
            return (
              React.DOM.div( {className:"back-pick_choice",
                  key:type,
                  title:back.description,
                  onClick:this.props.onSelect.bind(null, type)}, 
                React.DOM.div( {className:"back-pick_button"}, 
                  React.DOM.i( {className:'fa fa-' + back.icon}),
                  React.DOM.span( {className:"back-pick_title"}, 
                    back.title
                  )
                ),
                React.DOM.p( {className:"back-pick_description"}, 
                  back.description
                )
              )
            )
          }.bind(this))
        
      )
    )
  }
})

// vim: set tabstop=2 shiftwidth=2 expandtab:


if (window.fusion) window.fusion.register(module.exports, "/Users/khanintern1/clone/notablemind/lib/back-pick.jsx", require("/Users/khanintern1/clone/notablemind/lib/back-pick.json"));
module.exports._file_origin = "/Users/khanintern1/clone/notablemind/lib/back-pick.jsx";
},{"/Users/khanintern1/clone/notablemind/lib/back-pick.json":3}],5:[function(require,module,exports){
/** @jsx React.DOM */

var BackDrop = require('./back-drop.jsx')
  , BackPick = require('./back-pick.jsx')

var BackPicker = module.exports = React.createClass({
  displayName: 'BackPicker',
  getDefaultProps: function () {
    return {
      // should override
      onReady: function (back, type) {
        console.log('ready with back', back, type)
      },
      backs: {
      },
      currentBack: null,
      dropdown: false,
      // don't have to override
      setType: function (type) {
        localStorage._notablemind_backend = type
      },
      getType: function () {
        return localStorage._notablemind_backend || null
      }
    }
  },
  getInitialState: function () {
    return {
      loading: false,
      error: null
    }
  },
  componentDidMount: function () {
    if (this.props.currentBack) return
    var type = this.props.getType()
    if (!type) return
    // TODO do I reset this?
    this.initBack(type)
  },
  setBackType: function (type) {
    this.props.setType(type)
    this.initBack(type)
  },
  initBack: function (type) {
    var opt = this.props.backs[type]
    if (!opt) {
      return this.setState({type: null, error: 'Invalid storage type: ' + type})
    }
    this.setState({loading: type, error: null})
    var back = new opt.cls(opt.options || {})
    back.init(function (err) {
      if (err) {
        return this.setState({
          error: 'Failed to connect to storage: ' + err.message,
          loading: false,
          type: null
        })
      }
      if (this.isMounted()) {
        this.setState({loading: false})
      }
      this.props.onReady(back, type)
    }.bind(this))
  },
  onShow: function () {
    this.setState({showing: true})
  },
  onHide: function (e) {
    e.preventDefault()
    e.stopPropagation()
    this.setState({showing: false})
  },
  componentDidUpdate: function () {
    if (!this.props.dropdown) return
    if (this.state.showing) {
      window.addEventListener('mousedown', this.onHide)
    } else {
      window.addEventListener('mousedown', this.onHide)
    }
  },
  render: function () {
    var cls = this.props.dropdown ? BackDrop : BackPick
    return cls({
      onSelect: this.setBackType,
      backs: this.props.backs,
      loading: this.state.loading,
      currentType: this.props.getType()
    })
  }
})


if (window.fusion) window.fusion.register(module.exports, "/Users/khanintern1/clone/notablemind/lib/backend-picker.jsx", false);
module.exports._file_origin = "/Users/khanintern1/clone/notablemind/lib/backend-picker.jsx";
},{"./back-drop.jsx":2,"./back-pick.jsx":4}],6:[function(require,module,exports){
module.exports={
  "simple": {
    "backType": "local",
    "back": true,
    "backs": {
      "local": {
        "shortname": "Local",
        "description": "Something descriptive",
        "icon": "computer"
      },
      "dropbox": {
        "shortname": "Dropbox",
        "description": "Something descriptive about db",
        "icon": "dropbox"
      }
    }
  },
  "_style": {
    "display": "block"
  },
  "_log": ["onImport", "onLogout", "getDataDump"]
}

},{}],7:[function(require,module,exports){
/** @jsx React.DOM */

var d = React.DOM
  , BackendPicker = require('./backend-picker.jsx')
  , Importer = require('./importer.jsx')

var Header = module.exports = React.createClass({
  displayName: 'Header',
  propTypes: {
    back: React.PropTypes.object,
    links: React.PropTypes.array,
    backType: React.PropTypes.string,
    onLogout: React.PropTypes.func.isRequired,
    onImport: React.PropTypes.func.isRequired,
    getDataDump: React.PropTypes.func.isRequired
  },
  getDefaultProps: function () {
    return {
      links: [
        {
          icon: 'help',
          title: 'Problem?',
          url: 'https://nm-errors.herokuapp.com/new'
        }, {
          icon: 'github',
          title: 'Contribute', 
          url: 'https://notablemind.github.io'
        }, {
          icon: 'about',
          title: 'About',
          url: 'https://notablemind.com'
        }
      ],
      back: null,
      backType: null,
      onChangeBack: function (back, type) {
        console.log('want to change to type:', back, type)
      }
    }
  },
  onClickDownload: function () {
    var a = this.refs.download_link.getDOMNode()
      , data = this.props.getDataDump()
      , blob = new Blob([JSON.stringify(data, null, 2)],
                        {type: 'application/json'})
      , url = URL.createObjectURL(blob)
    a.href = url
    a.download = 'notablemind-export.json'
  },
  render: function () {
    return (
      React.DOM.div( {className:"header"}, 
        React.DOM.h1( {className:"header_title"}, "Notablemind"),
        React.DOM.ul( {className:"header_links"}, 
          
            this.props.links.map(function (link, i) {
              return (
                React.DOM.li( {key:i}, 
                  React.DOM.a( {className:"header_link",
                     href:link.url, target:"_blank",
                     title:link.title}, 
                    link.icon && d.i({className: 'fa fa-' + link.icon}),
                    link.title
                  )
                )
              )
            })
          
        ),
        React.DOM.div( {className:"header_spacer"}),
        Importer( {btnClassName:"header_import", onLoad:this.props.onImport}),
        React.DOM.a( {className:"header_download",
           ref:"download_link",
           onClick:this.onClickDownload}, 
            React.DOM.i( {className:"fa fa-download"})
        ),
        React.DOM.button( {className:"header_logout", onClick:this.props.onLogout}, 
          "Logout"
        )
        /*<BackendPicker currentBack={this.props.back}
          dropdown={true}
          backs={this.props.backs}
          onReady={this.props.onChangeBack}/>*/
      )
    )
  }
})

// vim: set tabstop=2 shiftwidth=2 expandtab:


if (window.fusion) window.fusion.register(module.exports, "/Users/khanintern1/clone/notablemind/lib/header.jsx", require("/Users/khanintern1/clone/notablemind/lib/header.json"));
module.exports._file_origin = "/Users/khanintern1/clone/notablemind/lib/header.jsx";
},{"./backend-picker.jsx":5,"./importer.jsx":11,"/Users/khanintern1/clone/notablemind/lib/header.json":6}],8:[function(require,module,exports){
/** @jsx React.DOM */

var BackPicker = require('./backend-picker.jsx')

var Hello = module.exports = React.createClass({
  displayName: 'Hello',
  getDefaultProps: function () {
    return {
      backs: {},
      onReady: function (back, type) {
        console.log('back ready', back, type)
      }
    }
  },
  render: function () {
    return (
      React.DOM.div( {className:"hello"}, 
        React.DOM.h1(null, "Notablemind"),
        BackPicker( {onReady:this.props.onReady, backs:this.props.backs}),
        React.DOM.ul(null, 
          React.DOM.li(null, "You own your data"),
          React.DOM.li(null, "Free and open source"),
          React.DOM.li(null, "Keyboard optimized")
        ),
        React.DOM.h3(null, "Roadmap"),
        React.DOM.ul(null, 
          React.DOM.li(null, "google drive sync"),
          React.DOM.li(null, "custom server for collaboration"),
          React.DOM.li(null, "whiteboard")
        )
      )
    )
  }
})

// vim: set tabstop=2 shiftwidth=2 expandtab:


if (window.fusion) window.fusion.register(module.exports, "/Users/khanintern1/clone/notablemind/lib/hello.jsx", false);
module.exports._file_origin = "/Users/khanintern1/clone/notablemind/lib/hello.jsx";
},{"./backend-picker.jsx":5}],9:[function(require,module,exports){
module.exports={
  "simple": { },
  "_wrapState": {
    "prop": "file",
    "callback": "onChange"
  },
  "_log": ["onLoad", "onClose"],
  "_style": {
    "display": "block"
  }
}


},{}],10:[function(require,module,exports){
/** @jsx React.DOM */

var isValidFormat = require('./is-valid-format')

var ImportPopover = module.exports = React.createClass({
  displayName: 'ImportPopover',
  propTypes: {
    file: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired,
    onLoad: React.PropTypes.func.isRequired,
    onClose: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return {
      error: null,
      reader: null
    }
  },
  componentWillReceiveProps: function (nextProps) {
    if (this.props.file !== nextProps) {
      this.setState({error: false})
    }
  },

  _onSubmit: function () {
    var reader = new FileReader()

    reader.onerror = function () {
      this.setState({
        reader: null,
        error: 'Failed to load file.'
      })
    }.bind(this)

    reader.onabort = function () {
      this.setState({
        reader: null,
        error: 'Upload cancelled'
      })
    }.bind(this)

    reader.onload = function (evt) {
      var data
      try {
        data = JSON.parse(evt.target.result)
      } catch (e) {
        console.error("Failed to parse file", e, evt.target.results)
        return this.setState({
          reader: null,
          error: new Error("Invalid format. You can only import files that were exported from notablemind.")
        })
      }

      if (!isValidFormat(data)) {
        return this.setState({
          reader: null,
          error: new Error("Invalid format. You can only import files that were exported from notablemind.")
        })
      }

      this.setState({
        reader: null,
        error: null
      })

      this.props.onLoad(this.props.file.name, data, {})
    }.bind(this)

    reader.readAsText(this.props.file)

    this.setState({
      reader: reader,
      error: false,
    })

  },

  _onChange: function (e) {
    this.props.onChange(e.target.files[0])
  },
  _onRemove: function () {
    this.props.onChange(null)
  },

  render: function () {
    return React.DOM.div( {className:"import-popover"}, 
      React.DOM.h3( {className:"import-popover_title"}, 
        "Import into Notablemind"
      ),
      React.DOM.button( {onClick:this.props.onClose, className:"import-popover_close"}),
      this.body()
    )
  },

  body: function () {
    // loading
    if (this.state.reader) {
      return React.DOM.div( {className:"import-popover_loading"}, 
        React.DOM.i( {className:"fa fa-spin fa-spinner"}),
        React.DOM.span( {className:"import-popover_loading-text"}, 
          "Loading"
        )
      )
    }

    if (this.props.file) {
      return [
        React.DOM.div( {className:"import-popover_file"}, 
          React.DOM.span( {className:"import-popover_filename"}, this.props.file.name),
          React.DOM.button(
            {onClick:this._onRemove,
            className:"import-popover_remove"})
        ),
        this.state.error && React.DOM.p( {className:"import-popover_error"}, this.state.error.message),
        React.DOM.button( {className:"import-popover_submit", onClick:this._onSubmit}, "Import")
      ]
    }

    return [
      React.DOM.p( {className:"import-popover_upload-text"}, 
        "Drag and Drop or click to select a file."
      ),
      React.DOM.input( {type:"file", onChange:this._onChange})
    ]
  }
})


if (window.fusion) window.fusion.register(module.exports, "/Users/khanintern1/clone/notablemind/lib/import-popover.jsx", require("/Users/khanintern1/clone/notablemind/lib/import-popover.json"));
module.exports._file_origin = "/Users/khanintern1/clone/notablemind/lib/import-popover.jsx";
},{"./is-valid-format":14,"/Users/khanintern1/clone/notablemind/lib/import-popover.json":9}],11:[function(require,module,exports){
/** @jsx React.DOM */

var ImportPopover = require('./import-popover.jsx')

var Importer = module.exports = React.createClass({
  displayName: 'Importer',
  propTypes: {
    btnClassName: React.PropTypes.string,
    onLoad: React.PropTypes.func.isRequired
  },
  getInitialState: function () {
    return {
      dropping: false,
      showing: false,
      file: null
    }
  },

  componentDidMount: function () {
    window.addEventListener('dragenter', this._onDragOver)
    window.addEventListener('dragover', this._onDragOver)
    window.addEventListener('dragleave', this._onDragEnd)
    window.addEventListener('drop', this._onDrop)
  },
  componentWillUnmount: function () {
    window.removeEventListener('dragenter', this._onDragOver)
    window.removeEventListener('dragleave', this._onDragEnd)
    window.removeEventListener('dragover', this._onDragOver)
    window.removeEventListener('drop', this._onDrop)
  },

  _onDragOver: function (e) {
    e.preventDefault()
    this.setState({dropping: true})
    return false
  },
  _onDragEnd: function (e) {
    if (e.target.className.indexOf('import_dropper') !== -1) {
      this.setState({dropping: false})
    }
  },
  _onDrop: function (e) {
    e.preventDefault()
    e.stopPropagation()
    var file = e.dataTransfer.files[0]
    this.setState({file: file, dropping: false, showing: true})
    return false
  },

  _onShow: function () {
    this.setState({showing: true})
  },
  _onHide: function () {
    this.setState({showing: false})
  },
  _onLoad: function (filename, data, options) {
    this._onHide()
    this.props.onLoad(filename, data, options)
  },

  _onChangeFile: function (file) {
    this.setState({file: file})
  },

  render: function () {
    return React.DOM.div( {className:"importer"}, 
      React.DOM.button( {className:this.props.btnClassName, onClick:this._onShow}, 
        React.DOM.i( {className:"fa fa-upload"})
      ),
      React.DOM.div( {className:"import_dropper" + (this.state.dropping ? ' dropping' : '')}),
      this.state.showing && React.DOM.div( {className:"importer_back", onClick:this._onHide}),
      this.state.showing && this.popover()
    )
  },

  popover: function () {
    return ImportPopover({
      file: this.state.file,
      onClose: this._onHide,
      onChange: this._onChangeFile,
      onLoad: this._onLoad
    })
  }
})


if (window.fusion) window.fusion.register(module.exports, "/Users/khanintern1/clone/notablemind/lib/importer.jsx", false);
module.exports._file_origin = "/Users/khanintern1/clone/notablemind/lib/importer.jsx";
},{"./import-popover.jsx":10}],12:[function(require,module,exports){
/** @jsx React.DOM */

var HelloPage = require('./hello.jsx')
  , MainApp = require('./main')
  , Header = require('./header.jsx')
  , Importer = require('./importer.jsx')

  , Model = require('treed/skins/workflowy/model')
  , Controller = require('treed/skins/workflowy/controller')

  , loadModel = require('./load-model')

var NotableMind = module.exports = React.createClass({
  displayName: 'NotableMind',
  getDefaultProps: function () {
    return {
      backs: {}
    }
  },

  getInitialState: function () {
    return {
      backType: null,
      loadingModel: false,
      model: null,
      nm: null
    }
  },

  onChangeBack: function (back, backType) {
    this.setState({
      loadingModel: true,
      backType: backType
    })

    loadModel(back, Model, function (err, model) {
      if (err) {
        return this.setState({
          loadingModel: false,
          modelError: err,
          model: null,
          nm: null
        })
      }

      var nm = window.controller = new Controller(model)

      this.setState({
        loadingModel: false,
        modelError: null,
        model: model,
        nm: nm
      })
    }.bind(this))
  },

  getDataDump: function () {
    return this.state.nm.exportData()
  },

  _onLogout: function () {
    if (this.state.nm) {
      this.state.nm.destroy()
    }
    this.setState({nm: null, backType: null})
    localStorage._notablemind_backend = null
  },

  _onClickImport: function () {
    this.setState({
      importing: true
    })
  },

  // filename: string
  // data: look at model.importData for more info
  // options:
  // - not sure about options just yet.
  _onLoadImport: function (filename, data, options) {

    var now = new Date()
      , name = 'Imported on ' + now.toLocaleDateString() +
               ' at ' + now.toLocaleTimeString() +
               ' from ' + filename

    this.state.nm.importData({
      data: {
        name: name,
        done: false
      },
      collapsed: false,
      children: [data]
    })
  },

  render: function () {
    if (this.state.loadingModel) {
      return (
        React.DOM.div( {className:"notablemind"}, 
          "Loading..."
        )
      )
    }
    if (!this.state.nm) {
      return (
        React.DOM.div( {className:"notablemind"}, 
          HelloPage( {onReady:this.onChangeBack, backs:this.props.backs})
        )
      )
    }

    return (
      React.DOM.div( {className:"notablemind"}, 
        Header( {back:this.state.nm.model.db,
          backType:this.state.backType,
          backs:this.props.backs,
          onLogout:this._onLogout,
          onImport:this._onLoadImport,
          getDataDump:this.getDataDump}),
        MainApp(
            {ref:"app",
            nm:this.state.nm})
      )
    )
  }
})

// vim: set tabstop=2 shiftwidth=2 expandtab:


if (window.fusion) window.fusion.register(module.exports, "/Users/khanintern1/clone/notablemind/lib/index.jsx", false);
module.exports._file_origin = "/Users/khanintern1/clone/notablemind/lib/index.jsx";
},{"./header.jsx":7,"./hello.jsx":8,"./importer.jsx":11,"./load-model":15,"./main":16,"treed/skins/workflowy/controller":29,"treed/skins/workflowy/model":31}],13:[function(require,module,exports){

// initialize the database, getting all the data out of it to give to the
// model
// done(err, rootid, nodes)
module.exports = function (db, done) {
  db.findAll('root', function (err, roots) {
    if (err) return done(err)

    if (!roots.length) {
      return loadDefault(db, done)
    }

    db.findAll('node', function (err, nodes) {
      if (err) return done(new Error('Failed to load items'))
      if (!nodes.length) return done(new Error("Data corrupted - could not find root node"))

      var map = {}
        , id = roots[0].id
      for (var i=0; i<nodes.length; i++) {
        map[nodes[i].id] = nodes[i]
      }
      done(null, id, map)
    })
  })
}

var ROOT_ID = 50

function loadDefault(db, done) {

  // load default
  db.save('root', ROOT_ID, {id: ROOT_ID}, function () {
    var map = {}
    map[ROOT_ID] = {
      id: ROOT_ID,
      children: [],
      collapsed: false,
      data: {name: 'Home'},
      depth: 0
    }

    db.save('node', ROOT_ID, map[ROOT_ID], function () {
      done(null, ROOT_ID, map)
    })
  })

}


},{}],14:[function(require,module,exports){

var isValidFormat = module.exports = function (data) {
  if (!data.data || 'string' !== typeof data.data.name) {
    return false
  }
  if (data.children) {
    if (!Array.isArray(data.children)) {
      return false
    }
    for (var i=0; i<data.children.length; i++) {
      if (!isValidFormat(data.children[i])) {
        return false
      }
    }
  }
  return true
}


},{}],15:[function(require,module,exports){

var initDb = require('./init-db')

// db: a backend
// Model: the model class
// done(err, model)
module.exports = function (db, Model, done) {
  initDb(db, function (err, id, nodes) {
    if (err) return done(err)
    var model = window.model = new Model(id, nodes, db)
    done(null, model)
  })
}


},{"./init-db":13}],16:[function(require,module,exports){

var History = require('treed/skins/workflowy/history')
  , Wrapper = require('treed/skins/workflowy/wrap')
  , d = React.DOM

// manage lineage, create and initialize model instance. It owns the state for
// the model.
var MainApp = module.exports = React.createClass({
  displayName: 'MainPage',
  propTypes: {
    nm: React.PropTypes.object.isRequired
  },
  getInitialState: function () {
    return {
      lineage: [],
    }
  },

  componentDidMount: function () {
    this.props.nm.on('bullet', this.updateBread)
    this.props.nm.refreshBullet()
  },
  componentWillReceiveProps: function (nextProps) {
    if (nextProps.nm !== this.props.nm) {
      nextProps.nm.on('bullet', this.updateBread)
      nextProps.nm.refreshBullet()
      this.props.nm.off('bullet', this.updateBread)
    }
  },
  componentWillUnmount: function () {
    this.props.nm.off('bullet', this.updateBread)
  },

  changeBread: function (id) {
    this.props.nm.actions.clickBullet(id)
  },
  updateBread: function (lineage) {
    this.setState({lineage: lineage})
  },

  render: function () {
    return d.div({
      className: 'workflowme'
    }, History({
         items: this.state.lineage,
         onClick: this.changeBread,
       }),
       Wrapper({
         ref: 'wf',
         controller: this.props.nm,
         onBreadCrumb: this.updateBread
      })
    )
  }
})



if (window.fusion) window.fusion.register(module.exports, "/Users/khanintern1/clone/notablemind/lib/main.js", false);
module.exports._file_origin = "/Users/khanintern1/clone/notablemind/lib/main.js";
},{"treed/skins/workflowy/history":30,"treed/skins/workflowy/wrap":35}],17:[function(require,module,exports){

module.exports = {
  getInitialState: function () {
    return {
      showing: false
    }
  },
  componentDidUpdate: function (props, state) {
    if (this.state.showing === state.showing) return
    if (this.state.showing) {
      window.addEventListener('mousedown', this.onHide)
    } else {
      window.removeEventListener('mousedown', this.onHide)
    }
  },
  onShow: function () {
    this.setState({showing: true})
  },
  onHide: function (e) {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    this.setState({showing: false})
  }
}


},{}],18:[function(require,module,exports){

module.exports = BaseNode

var keys = require('./keys')
  , util = require('./util')

function BaseNode(data, options, isNew) {
  this.name = data.name
  this.isNew = isNew
  this.o = options
  this.o.keybindings = util.merge(this.default_keys, options.keys)

  this.editing = false
  this.setupNode();
}

BaseNode.addAction = function (name, binding, func) {
  if (!this.extra_actions) {
    this.extra_actions = {}
  }
  this.extra_actions[name] = {
    binding: binding,
    func: func
  }
}

BaseNode.prototype = {
  // public
  startEditing: function (fromStart) {
  },
  stopEditing: function () {
  },
  addEditText: function (text) {
  },
  setData: function (data) {
  },
  setAttr: function (attr, value) {
  },

  // protexted
  isAtStart: function () {
  },
  isAtEnd: function () {
  },
  isAtBottom: function () {
  },
  isAtTop: function () {
  },

  setupNode: function () {
  },
  setInputValue: function (value) {
  },
  getInputValue: function () {
  },
  setTextContent: function (value) {
  },
  getSelectionPosition: function () {
  },


  // Should there be a canStopEditing?
  focus: function () {
    this.startEditing();
  },
  blur: function () {
    this.stopEditing();
  },
  
  keyHandler: function () {
    var actions = {}
      , name
    for (name in this.o.keybindings) {
      actions[this.o.keybindings[name]] = this.actions[name]
    }

    if (this.extra_actions) {
      for (name in this.extra_actions) {
        if (!actions[name]) {
          actions[this.extra_actions[name].binding] = this.extra_actions[name].action
        }
      }
    }

    return keys(actions).bind(this)
  },


  default_keys: {
    'undo': 'ctrl+z',
    'redo': 'ctrl+shift+z',
    'collapse': 'alt+left',
    'uncollapse': 'alt+right',
    'dedent': 'shift+tab, shift+alt+left',
    'indent': 'tab, shift+alt+right',
    'move up': 'shift+alt+up',
    'move down': 'shift+alt+down',
    'up': 'up',
    'down': 'down',
    'left': 'left',
    'right': 'right',
    'add after': 'return',
    'insert return': 'shift+return',
    'merge up': 'backspace',
    'stop editing': 'escape',
  },

  actions: {
    'undo': function () {
      this.o.undo()
    },
    'redo': function () {
      this.o.redo()
    },
    'collapse': function () {
      this.o.toggleCollapse(true)
    },
    'uncollapse': function () {
      this.o.toggleCollapse(false)
    },
    'dedent': function () {
      this.o.moveLeft()
    },
    'indent': function () {
      this.o.moveRight()
    },
    'move up': function () {
      this.o.moveUp()
    },
    'move down': function () {
      this.o.moveDown()
    },
    'up': function () {
      if (this.isAtTop()) {
        this.o.goUp();
      } else {
        return true
      }
    },
    'down': function () {
      if (this.isAtBottom()) {
        this.o.goDown()
      } else {
        return true
      }
    },
    'left': function () {
      if (this.isAtStart()) {
        return this.o.goUp()
      }
      return true
    },
    'right': function () {
      if (this.isAtEnd()) {
        return this.o.goDown(true)
      }
      return true
    },
    'insert return': function (e) {
      return true
    },
    'add after': function () {
      var ss = this.getSelectionPosition()
        , name = this.getInputValue()
        , rest = null
      if (name.indexOf('\n') !== -1) {
        return true
      }
      if (ss < name.length) {
        rest = name.slice(ss)
        this.name = name.slice(0, ss)
        this.setInputValue(this.name)
        this.setTextContent(this.name)
      } else {
        this.name = name
        this.setInputValue(this.name)
        this.setTextContent(this.name)
      }
      if (!this.isNew) this.o.changed('name', this.name)
      this.o.addAfter(rest)
    },
    // on backspace
    'merge up': function () {
      var value = this.getInputValue()
      if (!value) {
        return this.o.remove()
      }
      if (this.isAtStart()) {
        return this.o.remove(value)
      }
      return true
    },
    'stop editing': function () {
      this.stopEditing();
    }
  },
}


},{"./keys":25,"./util":27}],19:[function(require,module,exports){

var commands = require('./commands')

module.exports = Commandeger

function makeCommand(type, args) {
  var names = commands[type].args
    , data = {}
  for (var i=0; i<names.length; i++) {
    data[names[i]] = args[i]
  }
  return {type: type, data: data}
}

function Commandeger(view, model) {
  this.commands = []
  this.histpos = 0
  this.view = view
  this.listeners = {}
  this.working = false
  this.model = model
}

Commandeger.prototype = {
  /**
   * You can pass in any number of type, args pairs.
   * Ex: executeCommands(t1, a1, t2, a2, ...)
   */
  executeCommands: function (type, args) {
    if (this.working) return
    var cmds = [];
    for (var i=0; i<arguments.length; i+=2) {
      cmds.push(makeCommand(arguments[i], arguments[i+1]))
    }
    if (this.histpos > 0) {
      this.commands = this.commands.slice(0, -this.histpos)
      this.histpos = 0
    }
    this.commands.push(cmds)
    for (var i=0; i<cmds.length; i++) {
      this.doCommand(cmds[i])
    }
    this.trigger('change')
  },
  trigger: function (what) {
    for (var item in this.listeners[what]) {
      this.listeners[what][item].apply(null, [].slice.call(arguments, 1))
    }
  },
  on: function (what, cb) {
    if (!this.listeners[what]) {
      this.listeners[what] = []
    }
    this.listeners[what].push(cb)
  },
  undo: function () {
    document.activeElement.blur()
    var pos = this.histpos ? this.histpos + 1 : 1
      , ix = this.commands.length - pos
    if (ix < 0) {
      return false // no more undo!
    }
    var cmds = this.commands[ix]
    for (var i=cmds.length-1; i>=0; i--) {
      this.undoCommand(cmds[i])
    }
    this.histpos += 1
    this.trigger('change')
    return true
  },
  redo: function () {
    var pos = this.histpos ? this.histpos - 1 : -1
      , ix = this.commands.length - 1 - pos
    if (ix >= this.commands.length) {
      return false // no more to redo!
    }
    var cmds = this.commands[ix]
    for (var i=0; i<cmds.length; i++) {
      this.redoCommand(cmds[i])
    }
    this.histpos -= 1
    this.trigger('change')
    return true
  },
  doCommand: function (cmd) {
    this.working = true
    commands[cmd.type].apply.call(cmd.data, this.view, this.model)
    this.working = false
  },
  undoCommand: function (cmd) {
    this.working = true
    commands[cmd.type].undo.call(cmd.data, this.view, this.model)
    this.working = false
  },
  redoCommand: function (cmd) {
    this.working = true
    var c = commands[cmd.type]
    ;(c.redo || c.apply).call(cmd.data, this.view, this.model)
    this.working = false
  },
}


},{"./commands":20}],20:[function(require,module,exports){

function copy(one) {
  if ('object' !== typeof one) return one
  var two = {}
  for (var name in one) {
    two[name] = one[name]
  }
  return two
}

module.exports = {
  collapse: {
    args: ['id', 'doCollapse'],
    apply: function (view, model) {
      model.setCollapsed(this.id, this.doCollapse)
      view.setCollapsed(this.id, this.doCollapse)
      view.goTo(this.id)
    },
    undo: function (view, model) {
      model.setCollapsed(this.id, !this.doCollapse)
      view.setCollapsed(this.id, !this.doCollapse)
      view.goTo(this.id)
    },
  },
  newNode: {
    args: ['pid', 'index', 'text'],
    apply: function (view, model) {
      var cr = model.create(this.pid, this.index, this.text)
      this.id = cr.node.id
      view.add(cr.node, cr.before)
      // view.startEditing(cr.node.id)
    },
    undo: function (view, model) {
      var ed = view.editing
      view.remove(this.id)
      this.saved = model.remove(this.id)
      var nid = model.ids[this.pid].children[this.index-1]
      if (nid === undefined) nid = this.pid
      if (ed) {
        view.startEditing(nid)
      } else {
        view.setActive(nid)
      }
    },
    redo: function (view, model) {
      var before = model.readd(this.saved)
      view.add(this.saved.node, before)
    }
  },
  appendText: {
    args: ['id', 'text'],
    apply: function (view, model) {
      this.oldtext = model.ids[this.id].data.name
      model.appendText(this.id, this.text)
      view.appendText(this.id, this.text)
    },
    undo: function (view, model) {
      model.setAttr(this.id, 'name', this.oldtext)
      view.setAttr(this.id, 'name', this.oldtext)
    }
  },
  changeNodeAttr: {
    args: ['id', 'attr', 'value'],
    apply: function (view, model) {
      this.oldvalue = copy(model.ids[this.id].data[this.attr])
      model.setAttr(this.id, this.attr, this.value)
      view.setAttr(this.id, this.attr, this.value)
      view.goTo(this.id)
    },
    undo: function (view, model) {
      model.setAttr(this.id, this.attr, this.oldvalue)
      view.setAttr(this.id, this.attr, this.oldvalue)
      view.goTo(this.id)
    }
  },
  changeNode: {
    args: ['id', 'newdata'],
    apply: function (view, model) {
      this.olddata = copy(model.ids[this.id].data)
      model.setData(this.id, this.newdata)
      view.setData(this.id, this.newdata)
      view.goTo(this.id)
    },
    undo: function (view, model) {
      model.setData(this.id, this.olddata)
      view.setData(this.id, this.olddata)
      view.goTo(this.id)
    }
  },
  remove: {
    args: ['id'],
    apply: function (view, model) {
      var below = model.nextSibling(this.id)
      if (undefined === below) below = model.idAbove(this.id)
      view.remove(this.id)
      this.saved = model.remove(this.id)
      view.startEditing(below)
    },
    undo: function (view, model) {
      var before = model.readd(this.saved)
      view.addTree(this.saved.node, before)
    }
  },
  copy: {
    args: ['ids'],
    apply: function (view, model) {
      var items = this.ids.map(function (id) {
        return model.dumpData(id, true)
      })
      model.clipboard = items
    },
    undo: function (view, model) {
    }
  },
  cut: {
    args: ['ids'],
    apply: function (view, model) {
      var items = this.ids.map(function (id) {
        view.remove(id)
        return model.dumpData(id, true)
      })
      model.clipboard = items

      var id = this.ids[this.ids.length-1]
      var below = model.nextSibling(id)
      if (undefined === below) below = model.idAbove(this.ids[0])
      this.saved = this.ids.map(function (id) {
        return model.remove(id)
      })

      if (view.editing) {
        view.startEditing(below)
      } else {
        view.setActive(below)
      }
    },
    undo: function (view, model) {
      var before
      for (var i=this.saved.length-1; i>=0; i--) {
        before = model.readd(this.saved[i])
        view.addTree(this.saved[i].node, before)
      }
      if (this.ids.length > 1) {
        view.setSelection(this.ids)
        view.setActive(this.ids[this.ids.length-1])
      }
    }
  },
  importData: {
    args: ['pid', 'index', 'data'],
    apply: function (view, model) {
      var pid = this.pid
        , index = this.index
        , ed = view.editing
        , item = this.data
      var cr = model.createNodes(pid, index, item)
      view.addTree(cr.node, cr.before)
      view.setCollapsed(cr.node.parent, false)
      model.setCollapsed(cr.node.parent, false)
      this.newid = cr.node.id
      if (ed) {
        view.startEditing(this.newids[0])
      } else {
        view.setActive(this.newids[0])
      }
    },
    undo: function (view, model) {
      var id = this.newid
      var below = model.nextSibling(id)
      if (undefined === below) below = model.idAbove(id)
      view.remove(id)
      this.saved = model.remove(id)
      if (view.editing) {
        view.startEditing(below)
      } else {
        view.setActive(below)
      }
      // view.remove(this.newid)
      // this.saved = model.remove(this.newid)
      model.clipboard = this.saved
    },
    redo: function (view, model) {
      // var before = model.readd(this.saved)
      // view.addTree(this.saved.node, before)
      var before = model.readd(this.saved)
      view.addTree(item.node, before)
    }
  },
  paste: {
    args: ['pid', 'index'],
    apply: function (view, model) {
      var pid = this.pid
        , index = this.index
        , ed = view.editing
      var ids = model.clipboard.map(function (item) {
        var cr = model.createNodes(pid, index, item)
        view.addTree(cr.node, cr.before)
        view.setCollapsed(cr.node.parent, false)
        model.setCollapsed(cr.node.parent, false)
        index += 1
        return cr.node.id
      })
      this.newids = ids
      if (ids.length == 1) {
        if (ed) {
          view.startEditing(this.newids[0])
        } else {
          view.setActive(this.newids[0])
        }
      } else {
        view.setSelection(ids)
        view.setActive(ids[ids.length-1])
      }
    },
    undo: function (view, model) {
      var id = this.newids[this.newids.length-1]
      var below = model.nextSibling(id)
      if (undefined === below) below = model.idAbove(this.newids[0])
      this.saved = this.newids.map(function (id) {
        view.remove(id)
        return model.remove(id)
      })
      if (view.editing) {
        view.startEditing(below)
      } else {
        view.setActive(below)
      }
      // view.remove(this.newid)
      // this.saved = model.remove(this.newid)
      model.clipboard = this.saved
    },
    redo: function (view, model) {
      // var before = model.readd(this.saved)
      // view.addTree(this.saved.node, before)
      this.saved.map(function (item) {
        var before = model.readd(item)
        view.addTree(item.node, before)
      })
    }
  },
  move: {
    args: ['id', 'pid', 'index'],
    apply: function (view, model) {
      this.opid = model.ids[this.id].parent
      this.oindex = model.ids[this.opid].children.indexOf(this.id)
      var before = model.move(this.id, this.pid, this.index)
      var parent = model.ids[this.opid]
        , lastchild = parent.children.length === 0
      view.move(this.id, this.pid, before, this.opid, lastchild)
      view.goTo(this.id)
    },
    undo: function (view, model) {
      var before = model.move(this.id, this.opid, this.oindex)
        , lastchild = model.ids[this.pid].children.length === 0
      view.move(this.id, this.opid, before, this.pid, lastchild)
      view.goTo(this.id)
    }
  }
}


},{}],21:[function(require,module,exports){

module.exports = Controller

var View = require('./view')
  , Commandeger = require('./commandeger')
  , DefaultNode = require('./default-node')
  , View = require('./view')

  , util = require('./util')

function Controller(model, o) {
  o = o || {viewOptions: {}}
  this.o = util.extend({
    View: View,
  }, o)
  this.o.viewOptions = util.extend({
    node: DefaultNode
  }, o.viewOptions)
  this.model = model
  this.view = new this.o.View(
    this.bindActions.bind(this),
    this.model, this,
    this.o.viewOptions
  )
  this.node = this.view.initialize(model.root)
  this.cmd = new Commandeger(this.view, this.model)

  var actions = {}
  for (var name in this.actions) {
    if ('string' === typeof this.actions[name]) actions[name] = this.actions[name]
    else actions[name] = this.actions[name].bind(this)
  }
  this.actions = actions
  this.listeners = {}
  // connect the two.
}

Controller.prototype = {
  undo: function () {this.cmd.undo()},
  redo: function () {this.cmd.redo()},
  on: function (evt, func) {
    if (!this.listeners[evt]) {
      this.listeners[evt] = []
    }
    this.listeners[evt].push(func)
  },
  off: function (evt, func) {
    if (!this.listeners[evt]) return false
    var i = this.listeners[evt].indexOf(func)
    if (i === -1) return false
    this.listeners[evt].splice(i, 1)
    return true
  },
  trigger: function (evt) {
    if (!this.listeners[evt]) return
    var args = [].slice.call(arguments, 1)
    for (var i=0; i<this.listeners[evt].length; i++) {
      this.listeners[evt][i].apply(null, args)
    }
  },

  bindActions: function (id) {
    var actions = {}
      , val
    for (var action in this.actions) {
      val = this.actions[action]
      if ('string' === typeof val) {
        val = this[val][action].bind(this[val], id)
      } else {
        val = val.bind(this, id)
      }
      actions[action] = val
    }
    return actions
  },

  importData: function (data) {
    this.model.createNodes(this.view.getActive(), 0, data)
    this.view.rebase(this.view.root)
  },

  exportData: function () {
    return this.model.dumpData(this.model.root, true)
  },

  executeCommands: function () {
    this.cmd.executeCommands.apply(this.cmd, arguments)
  },

  // public
  setCollapsed: function (id, doCollapse) {
    if (!this.model.hasChildren(id)) return
    if (this.model.isCollapsed(id) === doCollapse) return
    this.executeCommands('collapse', [id, doCollapse]);
  },
  addBefore: function (id, text) {
    var nw = this.model.idNew(id, true)
    this.executeCommands('newNode', [nw.pid, nw.index, text])
  },

  actions: {
    trigger: function () {
      this.trigger.apply(this, arguments)
    },
    goUp: function (id) {
      if (id === this.view.root) return
      if (id === 'new') return this.view.goTo(this.view.root)
      // should I check to see if it's ok?
      var above = this.model.idAbove(id)
      if (above === undefined) return
      this.view.startEditing(above);
    },
    goDown: function (id, fromStart) {
      if (id === 'new') return this.view.goTo(this.view.root)
      var below = this.model.idBelow(id, this.view.root)
      if (below === undefined) return
      this.view.startEditing(below, fromStart);
    },
    goLeft: function (id) {
      if (id === 'new') return this.view.goTo(this.view.root)
      if (id === this.view.root) return
      var parent = this.model.getParent(id)
      if (!parent) return
      this.view.startEditing(parent)
    },
    goRight: function (id) {
      if (id === 'new') return this.view.goTo(this.view.root)
      var child = this.model.getChild(id)
      if (!child) return
      this.view.startEditing(child)
    },
    startMoving: function (id) {
      if (id === 'new') return
      if (id === this.view.root) return
      this.view.startMoving(id)
    },

    // modification
    undo: function () {this.cmd.undo()},
    redo: function () {this.cmd.redo()},

    // commanders
    cut: function (ids) {
      if (ids === this.view.root) return
      if (!Array.isArray(ids)) {
        ids = [ids]
      }
      this.executeCommands('cut', [ids])
    },
    copy: function (ids) {
      if (!Array.isArray(ids)) {
        ids = [ids]
      }
      this.executeCommands('copy', [ids])
    },

    paste: function (id, above) {
      if (!this.model.clipboard) return
      var nw = this.model.idNew(id, above)
      this.executeCommands('paste', [nw.pid, nw.index])
    },
    changed: function (id, attr, value) {
      if (id === 'new') {
        if (!value) return
        var nw = this.view.removeNew()
        this.executeCommands('newNode', [nw.pid, nw.index, value])
        return
      }
      this.executeCommands('changeNodeAttr', [id, attr, value])
    },
    move: function (where, id, target) {
      var action = {
        before: 'ToBefore',
        after: 'ToAfter',
        child: 'Into'
      }[where]
      this.actions['move' + action](id, target)//target, id)
    },
    moveToBefore: function (id, sid) {
      if (id === this.view.root) return
      if (id === 'new') return
      var place = this.model.moveBeforePlace(sid, id)
      if (!place) return
      // if (this.model.samePlace(id, place)) return
      this.executeCommands('move', [id, place.pid, place.ix])
    },
    moveToAfter: function (id, sid) {
      if (id === this.view.root) return
      if (id === 'new') return
      var place = this.model.moveAfterPlace(sid, id)
      if (!place) return
      // if (this.model.samePlace(id, place)) return
      this.executeCommands('move', [id, place.pid, place.ix])
    },
    moveInto: function (id, pid) {
      if (id === this.view.root) return
      if (id === 'new') return
      if (this.model.samePlace(id, {pid: pid, ix: 0})) return
      if (!this.model.isCollapsed(pid)) {
        return this.executeCommands('move', [id, pid, 0])
      }
      this.executeCommands('collapse', [pid, false], 'move', [id, pid, 0])
    },
    moveRight: function (id) {
      if (id === this.view.root) return
      if (id === 'new') return
      var sib = this.model.prevSibling(id, true)
      if (undefined === sib) return
      if (!this.model.isCollapsed(sib)) {
        return this.executeCommands('move', [id, sib, false])
      }
      this.executeCommands('collapse', [sib, false], 'move', [id, sib, false])
    },
    moveLeft: function (id) {
      if (id === this.view.root) return
      if (id === 'new') return
      if (this.model.ids[id].parent === this.view.root) return
      // TODO handle multiple selected
      var place = this.model.shiftLeftPlace(id)
      if (!place) return
      this.executeCommands('move', [id, place.pid, place.ix])
    },
    moveUp: function (id) {
      if (id === this.view.root) return
      if (id === 'new') return
      // TODO handle multiple selected
      var place = this.model.shiftUpPlace(id)
      if (!place) return
      this.executeCommands('move', [id, place.pid, place.ix])
    },
    moveDown: function (id) {
      if (id === this.view.root) return
      if (id === 'new') return
      // TODO handle multiple selected
      var place = this.model.shiftDownPlace(id)
      if (!place) return
      this.executeCommands('move', [id, place.pid, place.ix])
    },
    moveToTop: function (id) {
      if (id === this.view.root) return
      if (id === 'new') return
      var first = this.model.firstSibling(id)
      if (undefined === first) return
      var pid = this.model.ids[first].parent
      if (pid === undefined) return
      var ix = this.model.ids[pid].children.indexOf(first)
      this.executeCommands('move', [id, pid, ix])
    },
    moveToBottom: function (id) {
      if (id === this.view.root) return
      if (id === 'new') return
      var last = this.model.lastSibling(id)
      if (undefined === last) return
      var pid = this.model.ids[last].parent
      if (pid === undefined) return
      var ix = this.model.ids[pid].children.indexOf(last)
      this.executeCommands('move', [id, pid, ix + 1])
    },
    toggleCollapse: function (id, yes) {
      if (id === this.view.root) return
      if (id === 'new') return
      if (arguments.length === 1) {
        yes = !this.model.ids[id].children.length || !this.model.isCollapsed(id)
      }
      if (yes) {
        id = this.model.findCollapser(id)
        if (!this.model.hasChildren(id) || this.model.isCollapsed(id)) return
      } else {
        if (!this.model.hasChildren(id) || !this.model.isCollapsed(id)) return
      }
      this.executeCommands('collapse', [id, yes])
    },
    addBefore: function (id, text) {
      if (id === this.view.root) return
      if (id === 'new') {
        // TODO: better behavior here
        return
      }
      var nw = this.model.idNew(id, true)
      this.executeCommands('newNode', [nw.pid, nw.index, text])
    },
    addAfter: function (id, text) {
      var nw
      if (id === 'new') {
        // TODO: better behavior here

        nw = this.view.removeNew()
        this.executeCommands(
          'newNode', [nw.pid, nw.index+1, '']
        )
        return
      }
      if (id === this.view.root) {
        if (this.view.newNode) return this.view.startEditing('new')
        this.view.addNew(id, 0)
        this.view.startEditing('new')
        return
      }
      nw = this.model.idNew(id, false, this.view.root)
      var ed = this.view.editing
      this.executeCommands('newNode', [nw.pid, nw.index, text])
      if (ed) this.view.startEditing()
    },
    remove: function (id, addText) {
      if (id === this.view.root) return
      if (id === 'new') return
      var before = this.model.idAbove(id)
      this.executeCommands(
        'remove', [id],
        'appendText', [before, addText || '']
      )
    },
    setEditing: 'view',
    doneEditing: 'view'
  }
}


},{"./commandeger":19,"./default-node":22,"./util":27,"./view":28}],22:[function(require,module,exports){

module.exports = DefaultNode

var BaseNode = require('./base-node')

if (window.marked) {
  marked.setOptions({
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: true
  })
}

function DefaultNode(data, options, isNew) {
  BaseNode.call(this, data, options, isNew)
}

DefaultNode.prototype = Object.create(BaseNode.prototype)
DefaultNode.prototype.constructor = DefaultNode
// merge(DefaultNode, BaseNode)

function tmerge(a, b) {
  for (var c in b) {
    a[c] = b[c]
  }
}

tmerge(DefaultNode.prototype, {
  setInputValue: function (value) {
    var html = value.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    this.input.innerHTML = html;
  },
  getInputValue: function () {
    return this.input.innerHTML
            .replace(/<div>/g, '\n').replace(/<br>/g, '\n')
            .replace(/<\/div>/g, '').replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>').replace(/\u200b/g, '')
  },
  setTextContent: function (value) {
    this.text.innerHTML = marked(value)
  },
  setupNode: function () {
    this.node = document.createElement('div')
    this.input = document.createElement('div')
    this.input.setAttribute('contenteditable', true)
    this.input.classList.add('treed__input')
    this.text = document.createElement('div')
    this.text.classList.add('treed__text')
    this.node.classList.add('treed__default-node')

    this.setTextContent(this.name)
    this.node.appendChild(this.text)
    this.registerListeners();
  },
  isAtTop: function () {
    var bb = this.input.getBoundingClientRect()
      , selr = window.getSelection().getRangeAt(0).getClientRects()[0]
    return selr.top < bb.top + 5
  },
  isAtBottom: function () {
    var bb = this.input.getBoundingClientRect()
      , selr = window.getSelection().getRangeAt(0).getClientRects()[0]
    return selr.bottom > bb.bottom - 5
  },
  getSelectionPosition: function () {
    var sel = window.getSelection()
      , ran = sel.getRangeAt(0)
    return ran.startOffset
  },
  startEditing: function (fromStart) {
    if (this.editing) return
    this.editing = true;
    this.setInputValue(this.name)
    this.node.replaceChild(this.input, this.text)
    this.input.focus();
    this.setSelection(!fromStart)
    this.o.setEditing()
  },
  stopEditing: function () {
    if (!this.editing) return
    console.log('stop eddint', this.isNew)
    var value = this.getInputValue()
    this.editing = false
    this.node.replaceChild(this.text, this.input)
    this.o.doneEditing();
    if (this.name != value || this.isNew) {
      this.setTextContent(value)
      this.name = value
      this.o.changed('name', this.name)
    }
  },

  isAtStart: function () {
    return this.getSelectionPosition() === 0
  },

  isAtEnd: function () {
    console.warn("THIS IS WRONG")
    return false
  },
  addEditText: function (text) {
    var pl = this.name.length
    this.name += text
    this.setInputValue(this.name)
    this.setTextContent(this.name)
    if (!this.editing) {
      this.editing = true;
      this.node.replaceChild(this.input, this.text)
      this.o.setEditing();
    }
    this.setSelection(pl)
  },
  setAttr: function (attr, value) {
    if (attr === 'name') {
      this.name = value
      this.setInputValue(value)
      this.setTextContent(value)
    }
  },

  registerListeners: function () {
    this.text.addEventListener('mousedown', function (e) {
      this.startEditing();
      e.preventDefault()
      return false
    }.bind(this))

    this.input.addEventListener('blur', function (e) {
      this.stopEditing();
      e.preventDefault()
      return false
    }.bind(this));
    
    var keyHandler = this.keyHandler()

    this.input.addEventListener('keydown', function (e) {
      e.stopPropagation()
      return keyHandler(e)
    })

  },
  setSelection: function (end) {
    var sel = window.getSelection()
    sel.selectAllChildren(this.input)
    try {
      sel['collapseTo' + (end ? 'End' : 'Start')]()
    } catch (e) {}
  },

})


},{"./base-node":18}],23:[function(require,module,exports){

module.exports = DungeonsAndDragons

function findTarget(targets, e) {
  for (var i=0; i<targets.length; i++) {
    if (targets[i].top > e.clientY) {
      return targets[i > 0 ? i-1 : 0]
    }
  }
  return targets[targets.length-1]
}

// Manages Dragging N Dropping
function DungeonsAndDragons(vl, action) {
  this.vl = vl
  this.action = action
}

DungeonsAndDragons.prototype = {
  startMoving: function (targets, id) {
    this.moving = {
      targets: targets,
      shadow: this.vl.makeDropShadow(),
      current: null
    }
    this.vl.setMoving(id, true)
    var onMove = function (e) {
      this.drag(id, e)
    }.bind(this)
    var onUp = function (e) {
      document.body.style.cursor = ''
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      this.drop(id, e)
    }.bind(this)

    document.body.style.cursor = 'move'
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  },
  drag: function (id, e) {
    if (this.moving.current) {
      this.vl.setDropping(this.moving.current.id, false, this.moving.current.place === 'child')
    }
    var target = findTarget(this.moving.targets, e)
    this.moving.shadow.moveTo(target)
    this.moving.current = target
    this.vl.setDropping(target.id, true, this.moving.current.place === 'child')
  },
  drop: function (id, e) {
    this.moving.shadow.remove()
    var current = this.moving.current
    this.vl.setMoving(id, false)
    if (!this.moving.current) return
    this.vl.setDropping(current.id, false, current.place === 'child')
    if (current.id === id) return
    this.action(current.place, id, current.id)
    this.moving = false
  },
}


},{}],24:[function(require,module,exports){

module.exports = DomViewLayer

function ensureInView(item) {
  var bb = item.getBoundingClientRect()
  if (bb.top < 0) return item.scrollIntoView()
  if (bb.bottom > window.innerHeight) {
    item.scrollIntoView(false)
  }
}

function DropShadow(height, clsName) {
  this.node = document.createElement('div')
  this.node.classList.add(clsName || 'treed__drop-shadow')
  this.height = height || 10
  document.body.appendChild(this.node)
}

DropShadow.prototype = {
  moveTo: function (target) {
    this.node.style.top = target.show.y - this.height/2 + 'px'
    this.node.style.left = target.show.left + 'px'
    this.node.style.height = this.height + 'px'
    // this.node.style.height = target.height + 10 + 'px'
    this.node.style.width = target.show.width + 'px'
  },
  remove: function () {
    this.node.parentNode.removeChild(this.node)
  }
}

function DomViewLayer(o) {
  this.dom = {}
  this.root = null
  this.o = o
}

DomViewLayer.prototype = {
  clear: function () {
    this.dom = {}
  },
  rebase: function (root) {
    root.parentNode.replaceChild(this.root, root)
  },
  dropTargets: function (root, model, moving, top) {
    var targets = []
      , bc = this.dom[root].head.getBoundingClientRect()
      , target
      , childTarget

    if (!top) {
      target = {
        id: root,
        top: bc.top,
        left: bc.left,
        width: bc.width,
        height: bc.height,
        place: 'after', // 'before',
        show: {
          left: bc.left,// + 20,
          width: bc.width,// - 20,
          y: bc.bottom
        }
      }
      if (model.ids[root].children.length && !model.isCollapsed(root)) {
        // show insert below children
        target.show.y = this.dom[root].ul.getBoundingClientRect().bottom
      }
      targets.push(target)
    }
    if (root === moving) return targets
    childTarget = {
      id: root,
      top: bc.bottom - 7,
      left: bc.left + 20,
      width: bc.width,
      place: 'child',
      show: {
        left: bc.left + 40,
        width: bc.width - 40,
        y: bc.top + bc.height
      },
      height: 7
    }
    targets.push(childTarget)

    if (model.isCollapsed(root) && !top) return targets
    var ch = model.ids[root].children
    for (var i=0; i<ch.length; i++) {
      targets = targets.concat(this.dropTargets(ch[i], model, moving))
    }
    return targets
  },
  makeDropShadow: function () {
    return new DropShadow()
  },

  remove: function (id, pid, lastchild) {
    var n = this.dom[id]
    if (!n.main.parentNode) return
    try {
      n.main.parentNode.removeChild(n.main)
    } catch (e) {return}
    delete this.dom[id]
    if (lastchild) {
      this.dom[pid].main.classList.add('treed__item--parent')
    }
  },
  addNew: function (node, bounds, before, children) {
    var dom = this.makeNode(node.id, node.data, node.depth - this.rootDepth, bounds)
    this.add(node.parent, before, dom, children)
    if (node.collapsed && node.children.length) {
      this.setCollapsed(node.id, true)
    }
  },
  add: function (parent, before, dom, children) {
    var p = this.dom[parent]
    if (before === false) {
      p.ul.appendChild(dom)
    } else {
      var bef = this.dom[before]
      p.ul.insertBefore(dom, bef.main)
    }
    if (children) {
      dom.classList.add('treed__item--parent')
    }
  },
  body: function (id) {
    if (!this.dom[id]) return
    return this.dom[id].body
  },
  move: function (id, pid, before, ppid, lastchild) {
    var d = this.dom[id]
    d.main.parentNode.removeChild(d.main)
    if (lastchild) {
      this.dom[ppid].main.classList.remove('treed__item--parent')
    }
    if (before === false) {
      this.dom[pid].ul.appendChild(d.main)
    } else {
      this.dom[pid].ul.insertBefore(d.main, this.dom[before].main)
    }
    this.dom[pid].main.classList.add('treed__item--parent')
  },
  clearSelection: function (selection) {
    for (var i=0; i<selection.length; i++) {
      if (!this.dom[selection[i]]) continue;
      this.dom[selection[i]].main.classList.remove('selected')
    }
  },
  showSelection: function (selection) {
    if (!selection.length) return
    // ensureInView(this.dom[selection[0]].body.node)
    for (var i=0; i<selection.length; i++) {
      this.dom[selection[i]].main.classList.add('selected')
    }
  },

  clearActive: function (id) {
    if (!this.dom[id]) return
    this.dom[id].main.classList.remove('active')
  },
  showActive: function (id) {
    if (!this.dom[id]) return console.warn('Trying to activate a node that is not rendered')
    ensureInView(this.dom[id].body.node)
    this.dom[id].main.classList.add('active')
  },

  setCollapsed: function (id, isCollapsed) {
    this.dom[id].main.classList[isCollapsed ? 'add' : 'remove']('collapsed')
  },

  setMoving: function (id, isMoving) {
    this.root.classList[isMoving ? 'add' : 'remove']('moving')
    this.dom[id].main.classList[isMoving ? 'add' : 'remove']('moving')
  },

  setDropping: function (id, isDropping, isChild) {
    var cls = 'dropping' + (isChild ? '-child' : '')
    this.dom[id].main.classList[isDropping ? 'add' : 'remove'](cls)
  },

  makeRoot: function (node, bounds) {
    var dom = this.makeNode(node.id, node.data, 0, bounds)
      , root = document.createElement('div')
    root.classList.add('treed')
    root.appendChild(dom)
    if (node.collapsed && node.children.length) {
      this.setCollapsed(node.id, true)
    }
    this.root = root
    this.rootDepth = node.depth
    return root
  },

  makeHead: function (body, actions) {
    var head = document.createElement('div')
      , collapser = document.createElement('div')
      , mover = document.createElement('div')

    collapser.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return
      actions.toggleCollapse()
    })
    collapser.classList.add('treed__collapser')

    mover.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return
      e.preventDefault()
      e.stopPropagation()
      actions.startMoving()
      return false
    })
    mover.classList.add('treed__mover')

    head.classList.add('treed__head')
    head.appendChild(collapser)
    head.appendChild(body.node);
    head.appendChild(mover)
    return head
  },

  makeNode: function (id, data, level, bounds) {
    var dom = document.createElement('li')
      , body = this.bodyFor(id, data, bounds)

    dom.classList.add('treed__item')
    // dom.classList.add('treed__item--level-' + level)

    var head = this.makeHead(body, bounds)
    dom.appendChild(head)

    var ul = document.createElement('ul')
    ul.classList.add('treed__children')
    dom.appendChild(ul)
    this.dom[id] = {main: dom, body: body, ul: ul, head: head}
    return dom
  },

  /** returns a dom node **/
  bodyFor: function (id, data, bounds) {
    var dom = new this.o.node(data, bounds, id === 'new')
    dom.node.classList.add('treed__body')
    return dom
  },

}


},{}],25:[function(require,module,exports){

module.exports = keys

var KEYS = {
  8: 'backspace',
  9: 'tab',
  13: 'return',
  27: 'escape',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  46: 'delete',
  113: 'f2',
  219: '[',
  221: ']'
}

function keyName(code) {
  if (code <= 90 && code >= 65) {
    return String.fromCharCode(code + 32)
  }
  return KEYS[code]
}

function keys(config) {
  var kmap = {}
    , prefixes = {}
    , cur_prefix = null
    , parts
    , part
    , seq
  for (var name in config) {
    parts = name.split(',')
    for (var i=0;i<parts.length;i++) {
      part = parts[i].trim()
      kmap[part] = config[name]
      if (part.indexOf(' ') !== -1) {
        seq = part.split(/\s+/g)
        var n = ''
        for (var j=0; j<seq.length-1; j++) {
          n += seq[j]
          prefixes[n] = true
        }
      }
    }
  }
  return function (e) {
    var name = keyName(e.keyCode)
    if (!name) {
      return console.log(e.keyCode)
    }
    if (e.altKey) name = 'alt+' + name
    if (e.shiftKey) name = 'shift+' + name
    if (e.ctrlKey) name = 'ctrl+' + name
    if (cur_prefix) {
      name = cur_prefix + ' ' + name
      cur_prefix = null
    }
    if (!kmap[name]) {
      if (prefixes[name]) {
        cur_prefix = name
      } else {
        cur_prefix = null
      }
      return
    }
    if (kmap[name].call(this, e) !== true) {
      e.preventDefault()
      e.stopPropagation()
      return false
    }
  }
}



},{}],26:[function(require,module,exports){

module.exports = Model


function Model(root, ids, db) {
  this.ids = ids
  this.root = root
  this.db = db
  this.nextid = 100
  this.clipboard = false
}

/**
 * A single node is
 * - id:
 * - parent: id
 * - children: [id, id, id]
 * - data: {}
 */

Model.prototype = {
  newid: function () {
    while (this.ids[this.nextid]) {
      this.nextid += 1
    }
    var id = this.nextid
    this.nextid += 1
    return id
  },

  // export all the data currently stored in the model
  // dumpData() -> all of it
  // dumpData(id) -> children of the given id
  // dumpData(id, true) -> include the ids in the dump
  // {
  //    id: ??,
  //    data: {},
  //    collapsed: ??,
  //    children: [recurse, ...]
  // }
  dumpData: function (id, noids) {
    if (arguments.length === 0) {
      id = this.root
    }
    var res = {data: {}}
      , n = this.ids[id]
    for (var name in n.data) {
      res.data[name] = n.data[name]
    }
    if (n.children.length) {
      res.children = []
      for (var i=0; i<n.children.length; i++) {
        res.children.push(this.dumpData(n.children[i], noids))
      }
    }
    if (!noids) res.id = id
    res.collapsed = n.collapsed
    return res
  },

  // createNodes(parentId, the index, data as it was dumped)
  // {
  //    name: "",
  //    ... other datas
  //    children: [node, ...]
  // }
  createNodes: function (pid, index, data) {
    var cr = this.create(pid, index, data.data)
    cr.node.collapsed = data.collapsed
    if (data.children) {
      for (var i=0; i<data.children.length; i++) {
        this.createNodes(cr.node.id, i, data.children[i])
      }
    }
    return cr
  },

  getBefore: function (pid, index) {
    var before = false
    if (index < this.ids[pid].children.length - 1) {
      before = this.ids[pid].children[index + 1]
    }
    return before
  },

  // operations
  create: function (pid, index, text) {
    var node = {
      id: this.newid(),
      data: {name: text || '', done: false},
      parent: pid,
      children: []
    }
    if (text && 'object' === typeof text) {
      node.data = text
    }
    this.ids[node.id] = node
    this.ids[pid].children.splice(index, 0, node.id)

    var before = false
    if (index < this.ids[pid].children.length - 1) {
      before = this.ids[pid].children[index + 1]
    }

    this.db.save('node', node.id, node)
    this.db.update('node', pid, {children: this.ids[pid].children})

    return {
      node: node,
      before: before
    }
  },
  remove: function (id) {
    if (id === this.root) return
    var n = this.ids[id]
      , p = this.ids[n.parent]
      , ix = p.children.indexOf(id)
    p.children.splice(ix, 1)
    delete this.ids[id]

    this.db.remove('node', id)
    this.db.update('node', n.parent, {children: p.children})
    // TODO: remove all child nodes

    return {id: id, node: n, ix: ix}
  },
  setAttr: function (id, attr, value) {
    this.ids[id].data[attr] = value
    this.db.update('node', id, {data: this.ids[id].data})
  },
  setData: function (id, data) {
    for (var name in data) {
      this.ids[id].data[name] = data[name]
    }
    this.db.update('node', id, data)
  },

  // other stuff
  setCollapsed: function (id, isCollapsed) {
    this.ids[id].collapsed = isCollapsed
    this.db.update('node', id, {collapsed: isCollapsed})
  },
  isCollapsed: function (id) {
    return this.ids[id].collapsed
  },
  hasChildren: function (id) {
    return this.ids[id].children.length
  },
  // add back something that was removed
  readd: function (saved) {
    this.ids[saved.id] = saved.node
    var children = this.ids[saved.node.parent].children
    children.splice(saved.ix, 0, saved.id)
    var before = false
    if (saved.ix < children.length - 1) {
      before = children[saved.ix + 1]
    }
    this.db.save('node', saved.node.id, saved.node)
    this.db.update('node', saved.node.parent, {children: children})
    return before
  },
  move: function (id, pid, index) {
    var n = this.ids[id]
      , opid = n.parent
      , p = this.ids[opid]
      , ix = p.children.indexOf(id)
    p.children.splice(ix, 1)
    if (index === false) index = this.ids[pid].children.length
    this.ids[pid].children.splice(index, 0, id)
    this.ids[id].parent = pid

    this.db.update('node', opid, {children: p.children})
    this.db.update('node', pid, {children: this.ids[pid].children})
    this.db.update('node', id, {parent: pid})

    var before = false
    if (index < this.ids[pid].children.length - 1) {
      before = this.ids[pid].children[index + 1]
    }
    return before
  },
  appendText: function (id, text) {
    this.ids[id].data.name += text
    this.db.update('node', id, {data: this.ids[id].data})
  },

  // movement calculation
  getParent: function (id) {
    return this.ids[id].parent
  },
  commonParent: function (one, two) {
    if (one === two) return one
    var ones = [one]
      , twos = [two]
    while (this.ids[one].parent || this.ids[two].parent) {
      if (this.ids[one].parent) {
        one = this.ids[one].parent
        if (twos.indexOf(one) !== -1) return one
        ones.push(one)
      }
      if (this.ids[two].parent) {
        two = this.ids[two].parent
        if (ones.indexOf(two) !== -1) return two
        twos.push(two)
      }
    }
    return null
  },
  getChild: function (id) {
    if (this.ids[id].children && this.ids[id].children.length) {
      return this.ids[id].children[0]
    }
    return this.nextSibling(id)
  },
  prevSibling: function (id, noparent) {
    var pid = this.ids[id].parent
    if (undefined === pid) return
    var ix = this.ids[pid].children.indexOf(id)
    if (ix > 0) return this.ids[pid].children[ix-1]
    if (!noparent) return pid
  },
  nextSibling: function (id, strict) {
    var pid = this.ids[id].parent
    if (undefined === pid) return !strict && this.ids[id].children[0]
    var ix = this.ids[pid].children.indexOf(id)
    if (ix < this.ids[pid].children.length - 1) return this.ids[pid].children[ix + 1]
    if (this.ids[id].collapsed) {
      return !strict && this.nextSibling(pid, strict)
    }
    return !strict && this.ids[id].children[0]
  },
  lastSibling: function (id, strict) {
    var pid = this.ids[id].parent
    if (undefined === pid) return !strict && this.ids[id].children[0]
    var ix = this.ids[pid].children.indexOf(id)
    if (ix === this.ids[pid].children.length - 1) return !strict && this.ids[id].children[0]
    return this.ids[pid].children[this.ids[pid].children.length - 1]
  },
  firstSibling: function (id, strict) {
    var pid = this.ids[id].parent
    if (undefined === pid) return // this.ids[id].children[0]
    var ix = this.ids[pid].children.indexOf(id)
    if (ix === 0) return !strict && pid
    return this.ids[pid].children[0]
  },
  lastOpen: function (id) {
    var node = this.ids[id]
    while (node.children.length && (node.id === id || !node.collapsed)) {
      node = this.ids[node.children[node.children.length - 1]]
    }
    return node.id
  },
  idAbove: function (id) {
    var pid = this.ids[id].parent
      , parent = this.ids[pid]
    if (!parent) return
    var ix = parent.children.indexOf(id)
    if (ix === 0) {
      return pid
    }
    var previd = parent.children[ix - 1]
    while (this.ids[previd].children &&
           this.ids[previd].children.length &&
           !this.ids[previd].collapsed) {
      previd = this.ids[previd].children[this.ids[previd].children.length - 1]
    }
    return previd
  },
  // get the place to shift left to
  shiftLeftPlace: function (id) {
    var pid = this.ids[id].parent
      , parent = this.ids[pid]
    if (!parent) return
    var ppid = parent.parent
      , pparent = this.ids[ppid]
    if (!pparent) return
    var pix = pparent.children.indexOf(pid)
    return {
      pid: ppid,
      ix: pix + 1
    }
  },
  shiftUpPlace: function (id) {
    var pid = this.ids[id].parent
      , parent = this.ids[pid]
    if (!parent) return
    var ix = parent.children.indexOf(id)
    if (ix === 0) {
      var pl = this.shiftLeftPlace(id)
      if (!pl) return
      pl.ix -= 1
      return pl
    }
    return {
      pid: pid,
      ix: ix - 1
    }
  },
  shiftDownPlace: function (id) {
    var pid = this.ids[id].parent
      , parent = this.ids[pid]
    if (!parent) return
    var ix = parent.children.indexOf(id)
    if (ix >= parent.children.length - 1) {
      return this.shiftLeftPlace(id)
    }
    return {
      pid: pid,
      ix: ix + 1
    }
  },
  moveBeforePlace: function (id, tid) {
    var sib = this.ids[id]
      , pid = sib.parent
      , opid = this.ids[tid].parent
    if (undefined === pid) return
    var parent = this.ids[pid]
    return {
      pid: pid,
      ix: parent.children.indexOf(id)
    }
  },
  moveAfterPlace: function (id, oid) {
    var sib = this.ids[id]
      , pid = sib.parent
      , opid = this.ids[oid].parent
    if (undefined === pid) return
    var oix = this.ids[opid].children.indexOf(oid)
    var parent = this.ids[pid]
      , ix = parent.children.indexOf(id) + 1
    if ( pid === opid && ix > oix) ix -= 1
    return {
      pid: pid,
      ix: ix
    }
  },
  idBelow: function (id, root) {
    if (this.ids[id].children &&
        this.ids[id].children.length &&
        (id === root || !this.ids[id].collapsed)) {
      return this.ids[id].children[0]
    }
    var pid = this.ids[id].parent
      , parent = this.ids[pid]
    if (!parent) return
    var ix = parent.children.indexOf(id)
    while (ix === parent.children.length - 1) {
      parent = this.ids[parent.parent]
      if (!parent) return
      ix = parent.children.indexOf(pid)
      pid = parent.id
    }
    return parent.children[ix + 1]
  },
  idNew: function (id, before, root) {
    var pid = this.ids[id].parent
      , parent
      , nix
    if (before) {
      parent = this.ids[pid]
      nix = parent.children.indexOf(id)
    } else if (id === this.root ||
        root === id ||
        (this.ids[id].children &&
        this.ids[id].children.length &&
        !this.ids[id].collapsed)) {
      pid = id
      nix = 0
    } else {
      parent = this.ids[pid]
      nix = parent.children.indexOf(id) + 1
    }
    return {
      pid: pid,
      index: nix
    }
  },
  samePlace: function (id, place) {
    var pid = this.ids[id].parent
    if (!pid || pid !== place.pid) return false
    var parent = this.ids[pid]
      , ix = parent.children.indexOf(id)
    return ix === place.ix
  },
  findCollapser: function (id) {
    if ((!this.ids[id].children ||
         !this.ids[id].children.length ||
         this.ids[id].collapsed) &&
        this.ids[id].parent !== undefined) {
      id = this.ids[id].parent
    }
    return id
  },
}


},{}],27:[function(require,module,exports){

module.exports = {
  extend: extend,
  merge: merge,
  make_listed: make_listed
}

function merge(a, b) {
  var c = {}
    , name
  for (name in a) {
    c[name] = a[name]
  }
  for (name in b) {
    c[name] = b[name]
  }
  return c
}

function extend(dest) {
  [].slice.call(arguments, 1).forEach(function (src) {
    for (var attr in src) {
        dest[attr] = src[attr]
    }
  })
  return dest
}

function load(db, tree) {
  var res = make_listed(tree, undefined, true)
  db.save('root', {id: res.id})
  for (var i=0; i<res.tree.length; i++) {
    db.save('node', res.tree[i])
  }
}

function make_listed(data, nextid, collapse) {
  var ids = {}
    , children = []
    , ndata = {}
    , res
    , i
  if (undefined === nextid) nextid = 100

  if (data.children) {
    for (i=0; i<data.children.length; i++) {
      res = make_listed(data.children[i], nextid, collapse)
      for (var id in res.tree) {
        ids[id] = res.tree[id]
        ids[id].depth += 1
      }
      children.push(res.id)
      nextid = res.id + 1
    }
    // delete data.children
  }
  for (var name in data) {
    if (name === 'children') continue;
    ndata[name] = data[name]
  }
  ndata.done = false
  var theid = data.id || nextid
  ids[theid] = {
    id: theid,
    data: ndata,
    children: children,
    collapsed: !!collapse,
    depth: 0
  }
  for (i=0; i<children.length; i++) {
    ids[children[i]].parent = theid;
  }
  return {id: theid, tree: ids}
}




},{}],28:[function(require,module,exports){

module.exports = View

function reversed(items) {
  var nw = []
  for (var i=items.length; i>0; i--) {
    nw.push(items[i - 1])
  }
  return nw
}

var DomViewLayer = require('./dom-vl')
  , DefaultNode = require('./default-node')
  , DungeonsAndDragons = require('./dnd')
  , keys = require('./keys')
  , util = require('./util')

function View(bindActions, model, ctrl, options) {
  options = options || {}
  this.mode = 'normal'
  this.selection = null
  this.sel_inverted = false
  this.active = null
  this.o = util.extend({
    node: DefaultNode,
    ViewLayer: DomViewLayer,
    noSelectRoot: false
  }, options)
  this.o.keybindings = util.merge(this.default_keys, options.keys)
  this.vl = new this.o.ViewLayer(this.o)
  this.bindActions = bindActions
  this.model = model
  this.ctrl = ctrl
  this.dnd = new DungeonsAndDragons(this.vl, ctrl.actions.move.bind(ctrl))
  this.lazy_children = {}

  this.newNode = null
  this.attachListeners()
}

View.prototype = {
  rebase: function (newroot, trigger) {
    this.vl.clear()
    var root = this.vl.root
    this.initialize(newroot)
    this.vl.rebase(root)
    this.ctrl.trigger('rebase', newroot)
  },
  initialize: function (root) {
    var node = this.model.ids[root]
      , rootNode = this.vl.makeRoot(node, this.bindActions(root))
    this.active = null
    this.selection = null
    this.lazy_children = {}
    this.root = root
    this.populateChildren(root)
    if (!node.children.length) {
      this.addNew(this.root, 0)
    }
    this.selectSomething()
    return rootNode
  },
  startMoving: function (id) {
    var targets = this.vl.dropTargets(this.root, this.model, id, true)
    this.dnd.startMoving(targets, id)
  },
  addNew: function (pid, index) {
    this.newNode = {
      pid: pid,
      index: index
    }
    var before = this.model.getBefore(pid, index-1)
    this.vl.addNew({
      id: 'new',
      data: {name: ''},
      parent: pid
    }, this.bindActions('new'), before)
  },
  removeNew: function () {
    if (!this.newNode) return false
    var nw = this.newNode
      , lastchild = !this.model.ids[nw.pid].children.length
    this.vl.remove('new', nw.pid, lastchild)
    this.newNode = null
    return nw
  },
  selectSomething: function () {
    var child
    if (!this.model.ids[this.root].children.length) {
      child = 'new'
    } else {
      child = this.model.ids[this.root].children[0]
    }
    this.goTo(child)
  },
  populateChildren: function (id) {
    var node = this.model.ids[id]
    if (node.collapsed && id !== this.root) {
      this.lazy_children[id] = true
      return
    }
    this.lazy_children[id] = false
    if (!node.children || !node.children.length) return
    for (var i=0; i<node.children.length; i++) {
      this.add(this.model.ids[node.children[i]], false, true)
      this.populateChildren(node.children[i])
    }
  },
  goTo: function (id) {
    if (this.mode === 'insert') {
      this.startEditing(id)
    } else {
      this.setActive(id)
    }
  },

  default_keys: {
    'cut': 'ctrl+x, delete, d d',
    'copy': 'ctrl+c, y y',
    'paste': 'p, ctrl+v',
    'paste above': 'shift+p, ctrl+shift+v',
    'visual mode': 'v, shift+v',

    'edit': 'return, a, shift+a, f2',
    'edit start': 'i, shift+i',
    'first sibling': 'shift+[',
    'last sibling': 'shift+]',
    'move to first sibling': 'shift+alt+[',
    'move to last sibling': 'shift+alt+]',
    'new after': 'o',
    'new before': 'shift+o',
    'jump to top': 'g g',
    'jump to bottom': 'shift+g',
    'up': 'up, k',
    'down': 'down, j',
    'left': 'left, h',
    'right': 'right, l',
    'next sibling': 'alt+j, alt+down',
    'prev sibling': 'alt+k, alt+up',
    'toggle collapse': 'z',
    'collapse': 'alt+h, alt+left',
    'uncollapse': 'alt+l, alt+right',
    'indent': 'tab, shift+alt+l, shift+alt+right',
    'dedent': 'shift+tab, shift+alt+h, shift+alt+left',
    'move down': 'shift+alt+j, shift+alt+down',
    'move up': 'shift+alt+k, shift+alt+i, shift+alt+up',
    'undo': 'ctrl+z, u',
    'redo': 'ctrl+shift+z, shift+r',
  },

  actions: {
    'cut': function () {
      if (this.active === null) return
      this.ctrl.actions.cut(this.active)
    },
    'copy': function () {
      if (this.active === null) return
      this.ctrl.actions.copy(this.active)
    },
    'paste': function () {
      if (this.active === null) return
      this.ctrl.actions.paste(this.active)
    },
    'paste above': function () {
      if (this.active === null) return
      this.ctrl.actions.paste(this.active, true)
    },
    'visual mode': function () {
      if (this.active === this.root) return
      this.setSelection([this.active])
    },

    'undo': function () {
      this.ctrl.undo();
    },
    'redo': function () {
      this.ctrl.redo();
    },
    'edit': function () {
      if (this.active === null) {
        this.active = this.root
      }
      this.vl.body(this.active).startEditing()
    },
    'edit start': function () {
      if (this.active === null) {
        this.active = this.root
      }
      this.vl.body(this.active).startEditing(true)
    },
    // nav
    'first sibling': function () {
      if (this.active === null) {
        return this.setActive(this.root)
      }
      if (this.active === 'new') return this.setActive(this.root)
      var first = this.model.firstSibling(this.active)
      if (undefined === first) return
      this.setActive(first)
    },
    'last sibling': function () {
      if (this.active === null) {
        return this.setActive(this.root)
      }
      if (this.active === 'new') return this.setActive(this.root)
      var last = this.model.lastSibling(this.active)
      if (undefined === last) return
      this.setActive(last)
    },
    'jump to top': function () {
      this.setActive(this.root)
    },
    'jump to bottom': function () {
      this.setActive(this.model.lastOpen(this.root))
      console.log('bottom')
      // pass
    },
    'up': function () {
      if (this.active === null) {
        this.setActive(this.root)
      } else {
        if (this.active === 'new') return this.setActive(this.root)
        var top = this.active
          , above = this.model.idAbove(top)
        if (above === undefined) above = top
        if (above === this.root && this.o.noSelectRoot) {
          return
        }
        this.setActive(above)
      }
    },
    'down': function () {
      if (this.active === null) {
        this.setActive(this.root)
      } else {
        if (this.active === 'new') return
        if (this.active === this.root &&
            !this.model.ids[this.root].children.length) {
          return this.setActive('new')
        }
        var top = this.active
          , above = this.model.idBelow(top, this.root)
        if (above === undefined) above = top
        this.setActive(above)
      }
    },
    'left': function () {
      if (this.active === null) {
        return this.setActive(this.root)
      }
      if (this.active === 'new') return this.setActive(this.root)
      var left = this.model.getParent(this.active)
      if (undefined === left) return
      this.setActive(left)
    },
    'right': function () {
      if (this.active === null) {
        return this.setActive(this.root)
      }
      if (this.active === 'new') return
      if (this.active === this.root &&
          !this.model.ids[this.root].children.length) {
        return this.setActive('new')
      }
      var right = this.model.getChild(this.active)
      if (this.model.isCollapsed(this.active)) return
      if (undefined === right) return
      this.setActive(right)
    },
    'next sibling': function () {
      if (this.active === null) {
        return this.setActive(this.root)
      }
      if (this.active === 'new') return
      var sib = this.model.nextSibling(this.active)
      if (undefined === sib) return
      this.setActive(sib)
    },
    'prev sibling': function () {
      if (this.active === null) {
        return this.setActive(this.root)
      }
      if (this.active === 'new') return this.setActive(this.root)
      var sib = this.model.prevSibling(this.active)
      if (undefined === sib) return
      this.setActive(sib)
    },
    'move to first sibling': function () {
      if (this.active === null) {
        return this.setActive(this.root)
      }
      if (this.active === 'new') return
      this.ctrl.actions.moveToTop(this.active)
    },
    'move to last sibling': function () {
      if (this.active === null) {
        return this.setActive(this.root)
      }
      if (this.active === 'new') return
      this.ctrl.actions.moveToBottom(this.active)
    },
    'new before': function () {
      if (this.active === null) return
      if (this.active === 'new') return this.startEditing()
      this.ctrl.addBefore(this.active)
      this.startEditing()
    },
    'new after': function () {
      if (this.active === null) return
      if (this.active === 'new') return this.startEditing()
      this.ctrl.actions.addAfter(this.active)
      this.startEditing()
    },
    // movez!
    'toggle collapse': function () {
      this.ctrl.actions.toggleCollapse(this.active)
    },
    'collapse': function () {
      if (this.active === null) {
        return this.setActive(this.root)
      }
      this.ctrl.actions.toggleCollapse(this.active, true)
    },
    'uncollapse': function () {
      if (this.active === null) {
        return this.setActive(this.root)
      }
      this.ctrl.actions.toggleCollapse(this.active, false)
    },
    'indent': function () {
      if (this.active === null) {
        return this.setActive(this.root)
      }
      this.ctrl.actions.moveRight(this.active)
    },
    'dedent': function () {
      if (this.active === null) {
        return this.setActive(this.root)
      }
      this.ctrl.actions.moveLeft(this.active)
    },
    'move down': function () {
      if (this.active === null) {
        return this.setActive(this.root)
      }
      this.ctrl.actions.moveDown(this.active)
    },
    'move up': function () {
      if (this.active === null) {
        return this.setActive(this.root)
      }
      this.ctrl.actions.moveUp(this.active)
    }
  },

  visual: {
    // movement
    'k, up': function () {
      var prev = this.model.prevSibling(this.active, true)
      if (!prev) return
      this.addToSelection(prev, true)
    },
    'j, down': function () {
      var next = this.model.nextSibling(this.active, true)
      if (!next) return
      this.addToSelection(next, false)
    },
    'shift+g': function () {
      var n = this.model.ids[this.selection[0]]
        , ch = this.model.ids[n.parent].children
        , ix = ch.indexOf(this.selection[0])
      this.setSelection(ch.slice(ix))
      this.sel_inverted = false
      this.setActive(ch[ch.length-1])
    },
    'g g': function () {
      var n = this.model.ids[this.selection[0]]
        , ch = this.model.ids[n.parent].children
        , ix = ch.indexOf(this.selection[0])
        , items = []
      for (var i=0; i<=ix; i++) {
        items.unshift(ch[i])
      }
      this.setSelection(items)
      this.sel_inverted = items.length > 1
      this.setActive(ch[0])
    },
    'v, shift+v, escape': function () {
      this.stopSelecting()
    },
    'i, a, shift+a': function () {
      this.startEditing(this.active)
    },
    'shift+i': function () {
      this.startEditing(this.active, true)
    },

    // editness
    'd, shift+d, ctrl+x': function () {
      var items = this.selection.slice()
      if (this.sel_inverted) {
        items = reversed(items)
      }
      this.ctrl.actions.cut(items)
      this.stopSelecting()
    },
    'y, shift+y, ctrl+c': function () {
      var items = this.selection.slice()
      if (this.sel_inverted) {
        items = reversed(items)
      }
      this.ctrl.actions.copy(items)
      this.stopSelecting()
    },
    'u, ctrl+z': function () {
      this.stopSelecting()
      this.ctrl.undo()
    },
    'shift+r, ctrl+shift+z': function () {
      this.stopSelecting()
      this.ctrl.redo()
    },
  },

  extra_actions: {},

  keyHandler: function () {
    var normal = {}
      , name
    for (name in this.o.keybindings) {
      if (!this.actions[name]) {
        throw new Error('Invalid configuration! Unknown action: ' + name)
      }
      normal[this.o.keybindings[name]] = this.actions[name]
    }

    if (this.extra_actions) {
      for (name in this.extra_actions) {
        if (!normal[name]) {
          normal[this.extra_actions[name].binding] = this.extra_actions[name].action
        }
      }
    }

    var handlers = {
      'insert': function () {},
      'normal': keys(normal),
      'visual': keys(this.visual)
    }

    return function () {
      return handlers[this.mode].apply(this, arguments)
    }.bind(this)
  },

  attachListeners: function () {
    var keydown = this.keyHandler()
    window.addEventListener('keydown', function (e) {
      if (this.mode === 'insert') return
      keydown.call(this, e)
    }.bind(this))
  },

  addTree: function (node, before) {
    if (!this.vl.body(node.parent)) {
      return this.rebase(node.parent, true)
    }
    this.add(node, before)
    if (!node.children.length) return
    for (var i=0; i<node.children.length; i++) {
      this.addTree(this.model.ids[node.children[i]], false)
    }
  },

  // operations
  add: function (node, before, dontfocus) {
    var ed = this.mode === 'insert'
      , children = !!node.children.length
    if (!this.vl.body(node.parent)) {
      return this.rebase(node.parent, true)
    }
    this.vl.addNew(node, this.bindActions(node.id), before, children)
    if (!dontfocus) {
      if (ed) {
        this.vl.body(node.id).startEditing()
      } else {
        this.setActive(node.id)
      }
    }
  },
  remove: function (id) {
    var pid = this.model.ids[id].parent
      , parent = this.model.ids[pid]
    if (!this.vl.body(id)) {
      return this.rebase(pid, true)
    }
    if (id === this.active) {
      this.setActive(this.root)
    }
    this.vl.remove(id, pid, parent && parent.children.length === 1)
    if (parent.children.length === 1 && pid === this.root) {
      setTimeout(function () {
      this.addNew(pid, 0)
      }.bind(this),0)
    }
  },
  setAttr: function (id, attr, value) {
    if (!this.vl.body(id)) {
      return this.rebase(id, true)
    }
    this.vl.body(id).setAttr(attr, value)
    if (this.mode === 'insert') {
      this.vl.body(id).startEditing()
    }
  },
  setData: function (id, data) {
    this.vl.body(id).setData(data)
    if (this.mode === 'insert') {
      this.vl.body(id).startEditing()
    }
  },
  appendText: function (id, text) {
    this.vl.body(id).addEditText(text)
  },
  move: function (id, pid, before, ppid, lastchild) {
    if (!this.vl.body(id)) {
      return this.rebase(this.model.commonParent(pid, ppid), true)
    }
    var ed = this.mode === 'insert'
    this.vl.move(id, pid, before, ppid, lastchild)
    if (ed) this.startEditing(id)
  },
  startEditing: function (id, fromStart) {
    if (arguments.length === 0) {
      id = this.active !== null ? this.active : this.root
    }
    if (id === this.root && this.o.noSelectRoot) {
      return
    }
    var body = this.vl.body(id)
    if (!body) return
    body.startEditing(fromStart)
  },
  setEditing: function (id) {
    if (this.mode === 'visual') {
      this.stopSelecting()
    }
    this.mode = 'insert'
    this.setActive(id)
  },
  doneEditing: function () {
    this.mode = 'normal'
  },
  setActive: function (id) {
    if (id === this.active) return
    if (this.active !== null) {
      this.vl.clearActive(this.active)
    }
    if (!this.vl.dom[id]) {
      id = this.root
    }
    this.active = id
    this.vl.showActive(id)
  },
  getActive: function () {
    if (!this.vl.dom[this.active]) {
      return this.root
    }
    return this.active
  },
  addToSelection: function (id, invert) {
    var ix = this.selection.indexOf(id)
    if (ix === -1) {
      this.selection.push(id)
      this.vl.showSelection([id])
      this.sel_inverted = invert
    } else {
      this.vl.clearSelection(this.selection.slice(ix + 1))
      this.selection = this.selection.slice(0, ix + 1)
      if (this.selection.length === 1) {
        this.sel_inverted = false
      }
    }
    this.setActive(id)
    console.log(this.sel_inverted)
  },
  setSelection: function (sel) {
    this.mode = 'visual'
    this.sel_inverted = false
    if (this.selection) {
      this.vl.clearSelection(this.selection)
    }
    this.selection = sel
    this.vl.showSelection(sel)
  },
  stopSelecting: function () {
    if (this.selection !== null) {
      this.vl.clearSelection(this.selection)
      this.selection = null
    }
    this.mode = 'normal'
  },
  setCollapsed: function (id, what) {
    /*
    if (!this.vl.body(id)) {
      return this.rebase(this.model.ids[id].parent)
    }
    */
    this.vl.setCollapsed(id, what)
    if (what) {
      if (this.mode === 'insert') {
        this.startEditing(id)
      } else {
        this.setActive(id)
      }
    } else {
      if (this.lazy_children[id]) {
        this.populateChildren(id)
      }
    }
    // TODO: event listeners?
  },

  // non-modifying stuff
  goUp: function (id) {
    // should I check to see if it's ok?
    var above = this.model.idAbove(id)
    if (above === false) return
    if (above === this.root && this.o.noSelectRoot) {
      return
    }
    this.vl.body(above).body.startEditing();
  },
  goDown: function (id, fromStart) {
    var below = this.model.idBelow(id, this.root)
    if (below === false) return
    this.vl.body(below).body.startEditing(fromStart)
  },
}


},{"./default-node":22,"./dnd":23,"./dom-vl":24,"./keys":25,"./util":27}],29:[function(require,module,exports){

var Controller = require('../../lib/controller')
  , util = require('../../lib/util')

  , WFNode = require('./node')
  , WFView = require('./view')
  , WFVL = require('./vl')

module.exports = WFController

function WFController(model, options) {
  options = util.merge({
    View: WFView,
    viewOptions: {
      ViewLayer: WFVL,
      node: WFNode
    },
  }, options)
  Controller.call(this, model, options)
  this.on('rebase', function (id) {
      this.trigger('bullet', this.model.getLineage(id))
  }.bind(this))
}

WFController.prototype = util.extend(Object.create(Controller.prototype), {
  refreshBullet: function () {
    this.trigger('bullet', this.model.getLineage(this.model.root))
  }
})

WFController.prototype.actions = util.extend({
  clickBullet: function (id) {
    if (id === 'new') return
    this.view.rebase(id)
    this.trigger('bullet', this.model.getLineage(id))
  },
  backALevel: function () {
    var root = this.view.root
      , pid = this.model.ids[root].parent
    if (!this.model.ids[pid]) return
    this.actions.clickBullet(pid)
  }
}, Controller.prototype.actions)


},{"../../lib/controller":21,"../../lib/util":27,"./node":32,"./view":33,"./vl":34}],30:[function(require,module,exports){

/** jshint: marked: false */
var d = React.DOM

var History = module.exports = React.createClass({
  displayName: 'History',
  getDefaultProps: function () {
    return {
      items: [],
      onClick: function () {}
    }
  },
  mouseDown: function (id, e) {
    if (e.button !== 0) return
    this.props.onClick(id)
  },
  render: function () {
    var that = this
    return d.ul(
      {className: 'breadcrumb'},
      this.props.items.slice(0, -1).map(function (item, i) {
        return d.li({
          key: item.id,
          className: 'treed__bread',
          onMouseDown: that.mouseDown.bind(null, item.id),
          dangerouslySetInnerHTML: {
            __html: marked(item.name)
          }
        })
      })
    )
  }
})


},{}],31:[function(require,module,exports){

var Model = require('../../lib/model')

module.exports = WFModel

function WFModel() {
  Model.apply(this, arguments)
}

WFModel.prototype = Object.create(Model.prototype)

WFModel.prototype.getLineage = function (id) {
  var lineage = []
  while (this.ids[id]) {
    lineage.unshift({
      name: this.ids[id].data.name,
      id: id
    })
    id = this.ids[id].parent
  }
  return lineage
}



},{"../../lib/model":26}],32:[function(require,module,exports){

var DefaultNode = require('../../lib/default-node')

module.exports = WFNode

function WFNode(data, options, isNew) {
  DefaultNode.call(this, data, options, isNew)
}

WFNode.prototype = Object.create(DefaultNode.prototype)
WFNode.prototype.constructor = WFNode

WFNode.prototype.setAttr = function (attr, value) {
  if (attr !== 'done') {
    DefaultNode.prototype.setAttr.call(this, attr, value)
    return
  }
  this.done = value
  if (value) {
    this.node.classList.add('listless__default-node--done')
  } else {
    this.node.classList.remove('listless__default-node--done')
  }
}

WFNode.prototype.extra_actions = {
  'rebase': {
    binding: 'alt+return',
    action: function () {
      this.o.clickBullet()
    }
  },
  'back a level': {
    binding: 'shift+alt+return',
    action: function () {
      this.o.backALevel()
    }
  },
  'toggle done': {
    binding: 'ctrl+return',
    action: function () {
      this.blur()
      this.o.changed('done', !this.done)
      this.focus()
      if (this.done) {
        this.o.goDown()
      }
    }
  }
}


},{"../../lib/default-node":22}],33:[function(require,module,exports){

var View = require('../../lib/view')

module.exports = WFView

function WFView() {
  View.apply(this, arguments)
}

WFView.prototype = Object.create(View.prototype)

WFView.prototype.extra_actions = {
  'rebase': {
    binding: 'alt+return',
    action: function () {
      this.ctrl.actions.clickBullet(this.active)
    }
  },
  'back a level': {
    binding: 'shift+alt+return',
    action: function () {
      this.ctrl.actions.backALevel()
    }
  },
  'toggle done': {
    binding: 'ctrl+return',
    action: function () {
      if (this.active === null) return
      var id = this.active
        , done = !this.model.ids[id].data.done
        , next = this.model.idBelow(id, this.root)
      if (next === undefined) next = id
      this.ctrl.actions.changed(this.active, 'done', done)
      if (done) {
        this.goTo(next)
      }
    }
  }
}


},{"../../lib/view":28}],34:[function(require,module,exports){

var DomViewLayer = require('../../lib/dom-vl')

module.exports = WFVL

function WFVL() {
  DomViewLayer.apply(this, arguments)
}

WFVL.prototype = Object.create(DomViewLayer.prototype)

WFVL.prototype.makeHead = function (body, actions) {
  var head = DomViewLayer.prototype.makeHead.call(this, body, actions)
    , bullet = document.createElement('div')
  bullet.classList.add('treed__bullet')
  bullet.addEventListener('mousedown', actions.clickBullet)
  head.insertBefore(bullet, head.childNodes[1])
  return head
}


},{"../../lib/dom-vl":24}],35:[function(require,module,exports){

var d = React.DOM

var Wrapper = module.exports = React.createClass({
  propTypes: {
    controller: React.PropTypes.object,
    onBullet: React.PropTypes.func,
    onBreadCrumb: React.PropTypes.func
  },

  componentDidMount: function () {
    setTimeout(function () {
      this._init(this.props);
    }.bind(this), 0)
  },
  componentWillReceiveProps: function (nextProps) {
    if (nextProps.controller === this.props.controller) return

    this._destroy()
    setTimeout(function () {
      this._init(nextProps)
    }.bind(this), 0)
  },

  _init: function (props) {
    this.getDOMNode().appendChild(props.controller.node)
  },
  _destroy: function () {
    if (!this.props.controller) return
    this.props.controller.node.parentNode.removeChild(this.props.controller.node)
    delete this.ctrl
  },

  render: function () {
    return d.div()
  }
})


},{}]},{},[12])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvdXNyL2xvY2FsL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2toYW5pbnRlcm4xL2Nsb25lL25vdGFibGVtaW5kL2xpYi9iYWNrLWRyb3AuanNvbiIsIi9Vc2Vycy9raGFuaW50ZXJuMS9jbG9uZS9ub3RhYmxlbWluZC9saWIvYmFjay1kcm9wLmpzeCIsIi9Vc2Vycy9raGFuaW50ZXJuMS9jbG9uZS9ub3RhYmxlbWluZC9saWIvYmFjay1waWNrLmpzb24iLCIvVXNlcnMva2hhbmludGVybjEvY2xvbmUvbm90YWJsZW1pbmQvbGliL2JhY2stcGljay5qc3giLCIvVXNlcnMva2hhbmludGVybjEvY2xvbmUvbm90YWJsZW1pbmQvbGliL2JhY2tlbmQtcGlja2VyLmpzeCIsIi9Vc2Vycy9raGFuaW50ZXJuMS9jbG9uZS9ub3RhYmxlbWluZC9saWIvaGVhZGVyLmpzb24iLCIvVXNlcnMva2hhbmludGVybjEvY2xvbmUvbm90YWJsZW1pbmQvbGliL2hlYWRlci5qc3giLCIvVXNlcnMva2hhbmludGVybjEvY2xvbmUvbm90YWJsZW1pbmQvbGliL2hlbGxvLmpzeCIsIi9Vc2Vycy9raGFuaW50ZXJuMS9jbG9uZS9ub3RhYmxlbWluZC9saWIvaW1wb3J0LXBvcG92ZXIuanNvbiIsIi9Vc2Vycy9raGFuaW50ZXJuMS9jbG9uZS9ub3RhYmxlbWluZC9saWIvaW1wb3J0LXBvcG92ZXIuanN4IiwiL1VzZXJzL2toYW5pbnRlcm4xL2Nsb25lL25vdGFibGVtaW5kL2xpYi9pbXBvcnRlci5qc3giLCIvVXNlcnMva2hhbmludGVybjEvY2xvbmUvbm90YWJsZW1pbmQvbGliL2luZGV4LmpzeCIsIi9Vc2Vycy9raGFuaW50ZXJuMS9jbG9uZS9ub3RhYmxlbWluZC9saWIvaW5pdC1kYi5qcyIsIi9Vc2Vycy9raGFuaW50ZXJuMS9jbG9uZS9ub3RhYmxlbWluZC9saWIvaXMtdmFsaWQtZm9ybWF0LmpzIiwiL1VzZXJzL2toYW5pbnRlcm4xL2Nsb25lL25vdGFibGVtaW5kL2xpYi9sb2FkLW1vZGVsLmpzIiwiL1VzZXJzL2toYW5pbnRlcm4xL2Nsb25lL25vdGFibGVtaW5kL2xpYi9tYWluLmpzIiwiL1VzZXJzL2toYW5pbnRlcm4xL2Nsb25lL25vdGFibGVtaW5kL2xpYi9wb3AtbWl4LmpzIiwiL1VzZXJzL2toYW5pbnRlcm4xL2Nsb25lL25vdGFibGVtaW5kL25vZGVfbW9kdWxlcy90cmVlZC9saWIvYmFzZS1ub2RlLmpzIiwiL1VzZXJzL2toYW5pbnRlcm4xL2Nsb25lL25vdGFibGVtaW5kL25vZGVfbW9kdWxlcy90cmVlZC9saWIvY29tbWFuZGVnZXIuanMiLCIvVXNlcnMva2hhbmludGVybjEvY2xvbmUvbm90YWJsZW1pbmQvbm9kZV9tb2R1bGVzL3RyZWVkL2xpYi9jb21tYW5kcy5qcyIsIi9Vc2Vycy9raGFuaW50ZXJuMS9jbG9uZS9ub3RhYmxlbWluZC9ub2RlX21vZHVsZXMvdHJlZWQvbGliL2NvbnRyb2xsZXIuanMiLCIvVXNlcnMva2hhbmludGVybjEvY2xvbmUvbm90YWJsZW1pbmQvbm9kZV9tb2R1bGVzL3RyZWVkL2xpYi9kZWZhdWx0LW5vZGUuanMiLCIvVXNlcnMva2hhbmludGVybjEvY2xvbmUvbm90YWJsZW1pbmQvbm9kZV9tb2R1bGVzL3RyZWVkL2xpYi9kbmQuanMiLCIvVXNlcnMva2hhbmludGVybjEvY2xvbmUvbm90YWJsZW1pbmQvbm9kZV9tb2R1bGVzL3RyZWVkL2xpYi9kb20tdmwuanMiLCIvVXNlcnMva2hhbmludGVybjEvY2xvbmUvbm90YWJsZW1pbmQvbm9kZV9tb2R1bGVzL3RyZWVkL2xpYi9rZXlzLmpzIiwiL1VzZXJzL2toYW5pbnRlcm4xL2Nsb25lL25vdGFibGVtaW5kL25vZGVfbW9kdWxlcy90cmVlZC9saWIvbW9kZWwuanMiLCIvVXNlcnMva2hhbmludGVybjEvY2xvbmUvbm90YWJsZW1pbmQvbm9kZV9tb2R1bGVzL3RyZWVkL2xpYi91dGlsLmpzIiwiL1VzZXJzL2toYW5pbnRlcm4xL2Nsb25lL25vdGFibGVtaW5kL25vZGVfbW9kdWxlcy90cmVlZC9saWIvdmlldy5qcyIsIi9Vc2Vycy9raGFuaW50ZXJuMS9jbG9uZS9ub3RhYmxlbWluZC9ub2RlX21vZHVsZXMvdHJlZWQvc2tpbnMvd29ya2Zsb3d5L2NvbnRyb2xsZXIuanMiLCIvVXNlcnMva2hhbmludGVybjEvY2xvbmUvbm90YWJsZW1pbmQvbm9kZV9tb2R1bGVzL3RyZWVkL3NraW5zL3dvcmtmbG93eS9oaXN0b3J5LmpzIiwiL1VzZXJzL2toYW5pbnRlcm4xL2Nsb25lL25vdGFibGVtaW5kL25vZGVfbW9kdWxlcy90cmVlZC9za2lucy93b3JrZmxvd3kvbW9kZWwuanMiLCIvVXNlcnMva2hhbmludGVybjEvY2xvbmUvbm90YWJsZW1pbmQvbm9kZV9tb2R1bGVzL3RyZWVkL3NraW5zL3dvcmtmbG93eS9ub2RlLmpzIiwiL1VzZXJzL2toYW5pbnRlcm4xL2Nsb25lL25vdGFibGVtaW5kL25vZGVfbW9kdWxlcy90cmVlZC9za2lucy93b3JrZmxvd3kvdmlldy5qcyIsIi9Vc2Vycy9raGFuaW50ZXJuMS9jbG9uZS9ub3RhYmxlbWluZC9ub2RlX21vZHVsZXMvdHJlZWQvc2tpbnMvd29ya2Zsb3d5L3ZsLmpzIiwiL1VzZXJzL2toYW5pbnRlcm4xL2Nsb25lL25vdGFibGVtaW5kL25vZGVfbW9kdWxlcy90cmVlZC9za2lucy93b3JrZmxvd3kvd3JhcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM1lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNob0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHM9e1xuICBcInNpbXBsZVwiOiB7XG4gICAgXCJjdXJyZW50VHlwZVwiOiBcImxvY2FsXCIsXG4gICAgXCJiYWNrc1wiOiB7XG4gICAgICBcImxvY2FsXCI6IHtcbiAgICAgICAgXCJzaG9ydG5hbWVcIjogXCJMb2NhbFwiLFxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiU29tZXRoaW5nIGRlc2NyaXB0aXZlXCIsXG4gICAgICAgIFwiaWNvblwiOiBcImNvbXB1dGVyXCJcbiAgICAgIH0sXG4gICAgICBcImRyb3Bib3hcIjoge1xuICAgICAgICBcInNob3J0bmFtZVwiOiBcIkRyb3Bib3hcIixcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIlNvbWV0aGluZyBkZXNjcmlwdGl2ZSBhYm91dCBkYlwiLFxuICAgICAgICBcImljb25cIjogXCJkcm9wYm94XCJcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIFwiX3dyYXBTdGF0ZVwiOiB7XG4gICAgXCJwcm9wXCI6IFwiY3VycmVudFR5cGVcIixcbiAgICBcImNhbGxiYWNrXCI6IFwib25TZWxlY3RcIlxuICB9LFxuICBcIl9zdHlsZVwiOiB7XG4gICAgXCJkaXNwbGF5XCI6IFwiYmxvY2tcIlxuICB9XG59XG5cbiIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXG52YXIgQmFja0Ryb3AgPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdCYWNrRHJvcCcsXG4gIG1peGluczogW3JlcXVpcmUoJy4vcG9wLW1peCcpXSxcbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGJhY2tzOiB7fSxcbiAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgY3VycmVudFR5cGU6ICcnLFxuICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZWxlY3RpbmcgdHlwZScsIHR5cGUpXG4gICAgICB9XG4gICAgfVxuICB9LFxuICBjYW5jZWxEb3duOiBmdW5jdGlvbiAoZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgfSxcbiAgb25TZWxlY3Q6IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgdGhpcy5vbkhpZGUoKVxuICAgIHRoaXMucHJvcHMub25TZWxlY3QodHlwZSlcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMubG9hZGluZykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcImJhY2stZHJvcCBiYWNrLWRyb3AtLWxvYWRpbmdcIn0sIFxuICAgICAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJiYWNrLWRyb3BfbG9hZGluZ1wifSwgXG4gICAgICAgICAgICBcIkNvbm5lY3RpbmcgdG8gXCIsIHRoaXMucHJvcHMubG9hZGluZyxcIi4uLlwiXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgfVxuICAgIHZhciBjbHMgPSAnYmFjay1kcm9wJ1xuICAgIGlmICh0aGlzLnN0YXRlLnNob3dpbmcpIHtcbiAgICAgIGNscyArPSAnIGJhY2stZHJvcC0tc2hvd2luZydcbiAgICB9XG4gICAgdmFyIGJhY2tzID0gT2JqZWN0LmtleXModGhpcy5wcm9wcy5iYWNrcylcbiAgICAgICwgY3VyID0gdGhpcy5wcm9wcy5iYWNrc1t0aGlzLnByb3BzLmN1cnJlbnRUeXBlXSB8fCB7fVxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOmNscywgb25Nb3VzZURvd246dGhpcy5jYW5jZWxEb3dufSwgXG4gICAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJiYWNrLWRyb3BfY3VycmVudFwiLCBvbkNsaWNrOnRoaXMub25TaG93fSwgXG4gICAgICAgICAgUmVhY3QuRE9NLmkoIHtjbGFzc05hbWU6J2ZhIGZhLScgKyBjdXIuaWNvbn0pLFxuICAgICAgICAgIFJlYWN0LkRPTS5zcGFuKCB7Y2xhc3NOYW1lOlwiYmFjay1kcm9wX3RpdGxlXCJ9LCBcbiAgICAgICAgICAgIGN1ci5zaG9ydG5hbWVcbiAgICAgICAgICApXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LkRPTS51bCgge2NsYXNzTmFtZTpcImJhY2stZHJvcF9saXN0XCJ9LCBcbiAgICAgICAgICBcbiAgICAgICAgICAgIGJhY2tzLm1hcChmdW5jdGlvbiAodHlwZSkge1xuICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gdGhpcy5wcm9wcy5jdXJyZW50VHlwZSkgcmV0dXJuXG4gICAgICAgICAgICAgIHZhciBiYWNrID0gdGhpcy5wcm9wcy5iYWNrc1t0eXBlXVxuICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIFJlYWN0LkRPTS5saSgge2NsYXNzTmFtZTpcImJhY2stZHJvcF9jaG9pY2VcIixcbiAgICAgICAgICAgICAgICAgICAga2V5OnR5cGUsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOmJhY2suZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s6dGhpcy5vblNlbGVjdC5iaW5kKG51bGwsIHR5cGUpfSwgXG4gICAgICAgICAgICAgICAgICBSZWFjdC5ET00uaSgge2NsYXNzTmFtZTonZmEgZmEtJyArIGJhY2suaWNvbn0pLFxuICAgICAgICAgICAgICAgICAgUmVhY3QuRE9NLnNwYW4oIHtjbGFzc05hbWU6XCJiYWNrLWRyb3BfdGl0bGVcIn0sIFxuICAgICAgICAgICAgICAgICAgICBiYWNrLnNob3J0bmFtZVxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKVxuICAgICAgICAgIFxuICAgICAgICApXG4gICAgICApXG4gICAgKVxuICB9XG59KVxuXG4vLyB2aW06IHNldCB0YWJzdG9wPTIgc2hpZnR3aWR0aD0yIGV4cGFuZHRhYjpcblxuXG5pZiAod2luZG93LmZ1c2lvbikgd2luZG93LmZ1c2lvbi5yZWdpc3Rlcihtb2R1bGUuZXhwb3J0cywgXCIvVXNlcnMva2hhbmludGVybjEvY2xvbmUvbm90YWJsZW1pbmQvbGliL2JhY2stZHJvcC5qc3hcIiwgcmVxdWlyZShcIi9Vc2Vycy9raGFuaW50ZXJuMS9jbG9uZS9ub3RhYmxlbWluZC9saWIvYmFjay1kcm9wLmpzb25cIikpO1xubW9kdWxlLmV4cG9ydHMuX2ZpbGVfb3JpZ2luID0gXCIvVXNlcnMva2hhbmludGVybjEvY2xvbmUvbm90YWJsZW1pbmQvbGliL2JhY2stZHJvcC5qc3hcIjsiLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwic2ltcGxlXCI6IHtcbiAgICBcImJhY2tzXCI6IHtcbiAgICAgIFwibG9jYWxcIjoge1xuICAgICAgICBcInNob3J0bmFtZVwiOiBcIkxvY2FsXCIsXG4gICAgICAgIFwiaWNvblwiOiBcImNvbXB1dGVyXCJcbiAgICAgIH0sXG4gICAgICBcImRyb3Bib3hcIjoge1xuICAgICAgICBcInNob3J0bmFtZVwiOiBcIkRyb3Bib3hcIixcbiAgICAgICAgXCJpY29uXCI6IFwiZHJvcGJveFwiXG4gICAgICB9XG4gICAgfVxuICB9LFxuICBcIl93cmFwU3RhdGVcIjoge1xuICAgIFwicHJvcFwiOiBcImN1cnJlbnRUeXBlXCIsXG4gICAgXCJjYWxsYmFja1wiOiBcIm9uU2VsZWN0XCJcbiAgfVxufVxuIiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG5cbnZhciBCYWNrUGljayA9IG1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ0JhY2tQaWNrJyxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMubG9hZGluZykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcImJhY2stcGljayBiYWNrLXBpY2stLWxvYWRpbmdcIn0sIFxuICAgICAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJiYWNrLXBpY2tfbG9hZGluZ1wifSwgXG4gICAgICAgICAgICBcIkNvbm5lY3RpbmcgdG8gXCIsIHRoaXMucHJvcHMubG9hZGluZyxcIi4uLlwiXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgfVxuICAgIHZhciBiYWNrcyA9IE9iamVjdC5rZXlzKHRoaXMucHJvcHMuYmFja3MpXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJiYWNrLXBpY2tcIn0sIFxuICAgICAgICBcbiAgICAgICAgICBiYWNrcy5tYXAoZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgICAgICAgIHZhciBiYWNrID0gdGhpcy5wcm9wcy5iYWNrc1t0eXBlXVxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcImJhY2stcGlja19jaG9pY2VcIixcbiAgICAgICAgICAgICAgICAgIGtleTp0eXBlLFxuICAgICAgICAgICAgICAgICAgdGl0bGU6YmFjay5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s6dGhpcy5wcm9wcy5vblNlbGVjdC5iaW5kKG51bGwsIHR5cGUpfSwgXG4gICAgICAgICAgICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcImJhY2stcGlja19idXR0b25cIn0sIFxuICAgICAgICAgICAgICAgICAgUmVhY3QuRE9NLmkoIHtjbGFzc05hbWU6J2ZhIGZhLScgKyBiYWNrLmljb259KSxcbiAgICAgICAgICAgICAgICAgIFJlYWN0LkRPTS5zcGFuKCB7Y2xhc3NOYW1lOlwiYmFjay1waWNrX3RpdGxlXCJ9LCBcbiAgICAgICAgICAgICAgICAgICAgYmFjay50aXRsZVxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgUmVhY3QuRE9NLnAoIHtjbGFzc05hbWU6XCJiYWNrLXBpY2tfZGVzY3JpcHRpb25cIn0sIFxuICAgICAgICAgICAgICAgICAgYmFjay5kZXNjcmlwdGlvblxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICAgIH0uYmluZCh0aGlzKSlcbiAgICAgICAgXG4gICAgICApXG4gICAgKVxuICB9XG59KVxuXG4vLyB2aW06IHNldCB0YWJzdG9wPTIgc2hpZnR3aWR0aD0yIGV4cGFuZHRhYjpcblxuXG5pZiAod2luZG93LmZ1c2lvbikgd2luZG93LmZ1c2lvbi5yZWdpc3Rlcihtb2R1bGUuZXhwb3J0cywgXCIvVXNlcnMva2hhbmludGVybjEvY2xvbmUvbm90YWJsZW1pbmQvbGliL2JhY2stcGljay5qc3hcIiwgcmVxdWlyZShcIi9Vc2Vycy9raGFuaW50ZXJuMS9jbG9uZS9ub3RhYmxlbWluZC9saWIvYmFjay1waWNrLmpzb25cIikpO1xubW9kdWxlLmV4cG9ydHMuX2ZpbGVfb3JpZ2luID0gXCIvVXNlcnMva2hhbmludGVybjEvY2xvbmUvbm90YWJsZW1pbmQvbGliL2JhY2stcGljay5qc3hcIjsiLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cblxudmFyIEJhY2tEcm9wID0gcmVxdWlyZSgnLi9iYWNrLWRyb3AuanN4JylcbiAgLCBCYWNrUGljayA9IHJlcXVpcmUoJy4vYmFjay1waWNrLmpzeCcpXG5cbnZhciBCYWNrUGlja2VyID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnQmFja1BpY2tlcicsXG4gIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAvLyBzaG91bGQgb3ZlcnJpZGVcbiAgICAgIG9uUmVhZHk6IGZ1bmN0aW9uIChiYWNrLCB0eXBlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdyZWFkeSB3aXRoIGJhY2snLCBiYWNrLCB0eXBlKVxuICAgICAgfSxcbiAgICAgIGJhY2tzOiB7XG4gICAgICB9LFxuICAgICAgY3VycmVudEJhY2s6IG51bGwsXG4gICAgICBkcm9wZG93bjogZmFsc2UsXG4gICAgICAvLyBkb24ndCBoYXZlIHRvIG92ZXJyaWRlXG4gICAgICBzZXRUeXBlOiBmdW5jdGlvbiAodHlwZSkge1xuICAgICAgICBsb2NhbFN0b3JhZ2UuX25vdGFibGVtaW5kX2JhY2tlbmQgPSB0eXBlXG4gICAgICB9LFxuICAgICAgZ2V0VHlwZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLl9ub3RhYmxlbWluZF9iYWNrZW5kIHx8IG51bGxcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgIGVycm9yOiBudWxsXG4gICAgfVxuICB9LFxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnByb3BzLmN1cnJlbnRCYWNrKSByZXR1cm5cbiAgICB2YXIgdHlwZSA9IHRoaXMucHJvcHMuZ2V0VHlwZSgpXG4gICAgaWYgKCF0eXBlKSByZXR1cm5cbiAgICAvLyBUT0RPIGRvIEkgcmVzZXQgdGhpcz9cbiAgICB0aGlzLmluaXRCYWNrKHR5cGUpXG4gIH0sXG4gIHNldEJhY2tUeXBlOiBmdW5jdGlvbiAodHlwZSkge1xuICAgIHRoaXMucHJvcHMuc2V0VHlwZSh0eXBlKVxuICAgIHRoaXMuaW5pdEJhY2sodHlwZSlcbiAgfSxcbiAgaW5pdEJhY2s6IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgdmFyIG9wdCA9IHRoaXMucHJvcHMuYmFja3NbdHlwZV1cbiAgICBpZiAoIW9wdCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe3R5cGU6IG51bGwsIGVycm9yOiAnSW52YWxpZCBzdG9yYWdlIHR5cGU6ICcgKyB0eXBlfSlcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7bG9hZGluZzogdHlwZSwgZXJyb3I6IG51bGx9KVxuICAgIHZhciBiYWNrID0gbmV3IG9wdC5jbHMob3B0Lm9wdGlvbnMgfHwge30pXG4gICAgYmFjay5pbml0KGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGVycm9yOiAnRmFpbGVkIHRvIGNvbm5lY3QgdG8gc3RvcmFnZTogJyArIGVyci5tZXNzYWdlLFxuICAgICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICAgIHR5cGU6IG51bGxcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmlzTW91bnRlZCgpKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2xvYWRpbmc6IGZhbHNlfSlcbiAgICAgIH1cbiAgICAgIHRoaXMucHJvcHMub25SZWFkeShiYWNrLCB0eXBlKVxuICAgIH0uYmluZCh0aGlzKSlcbiAgfSxcbiAgb25TaG93OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7c2hvd2luZzogdHJ1ZX0pXG4gIH0sXG4gIG9uSGlkZTogZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgdGhpcy5zZXRTdGF0ZSh7c2hvd2luZzogZmFsc2V9KVxuICB9LFxuICBjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMucHJvcHMuZHJvcGRvd24pIHJldHVyblxuICAgIGlmICh0aGlzLnN0YXRlLnNob3dpbmcpIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm9uSGlkZSlcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMub25IaWRlKVxuICAgIH1cbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNscyA9IHRoaXMucHJvcHMuZHJvcGRvd24gPyBCYWNrRHJvcCA6IEJhY2tQaWNrXG4gICAgcmV0dXJuIGNscyh7XG4gICAgICBvblNlbGVjdDogdGhpcy5zZXRCYWNrVHlwZSxcbiAgICAgIGJhY2tzOiB0aGlzLnByb3BzLmJhY2tzLFxuICAgICAgbG9hZGluZzogdGhpcy5zdGF0ZS5sb2FkaW5nLFxuICAgICAgY3VycmVudFR5cGU6IHRoaXMucHJvcHMuZ2V0VHlwZSgpXG4gICAgfSlcbiAgfVxufSlcblxuXG5pZiAod2luZG93LmZ1c2lvbikgd2luZG93LmZ1c2lvbi5yZWdpc3Rlcihtb2R1bGUuZXhwb3J0cywgXCIvVXNlcnMva2hhbmludGVybjEvY2xvbmUvbm90YWJsZW1pbmQvbGliL2JhY2tlbmQtcGlja2VyLmpzeFwiLCBmYWxzZSk7XG5tb2R1bGUuZXhwb3J0cy5fZmlsZV9vcmlnaW4gPSBcIi9Vc2Vycy9raGFuaW50ZXJuMS9jbG9uZS9ub3RhYmxlbWluZC9saWIvYmFja2VuZC1waWNrZXIuanN4XCI7IiwibW9kdWxlLmV4cG9ydHM9e1xuICBcInNpbXBsZVwiOiB7XG4gICAgXCJiYWNrVHlwZVwiOiBcImxvY2FsXCIsXG4gICAgXCJiYWNrXCI6IHRydWUsXG4gICAgXCJiYWNrc1wiOiB7XG4gICAgICBcImxvY2FsXCI6IHtcbiAgICAgICAgXCJzaG9ydG5hbWVcIjogXCJMb2NhbFwiLFxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiU29tZXRoaW5nIGRlc2NyaXB0aXZlXCIsXG4gICAgICAgIFwiaWNvblwiOiBcImNvbXB1dGVyXCJcbiAgICAgIH0sXG4gICAgICBcImRyb3Bib3hcIjoge1xuICAgICAgICBcInNob3J0bmFtZVwiOiBcIkRyb3Bib3hcIixcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIlNvbWV0aGluZyBkZXNjcmlwdGl2ZSBhYm91dCBkYlwiLFxuICAgICAgICBcImljb25cIjogXCJkcm9wYm94XCJcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIFwiX3N0eWxlXCI6IHtcbiAgICBcImRpc3BsYXlcIjogXCJibG9ja1wiXG4gIH0sXG4gIFwiX2xvZ1wiOiBbXCJvbkltcG9ydFwiLCBcIm9uTG9nb3V0XCIsIFwiZ2V0RGF0YUR1bXBcIl1cbn1cbiIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXG52YXIgZCA9IFJlYWN0LkRPTVxuICAsIEJhY2tlbmRQaWNrZXIgPSByZXF1aXJlKCcuL2JhY2tlbmQtcGlja2VyLmpzeCcpXG4gICwgSW1wb3J0ZXIgPSByZXF1aXJlKCcuL2ltcG9ydGVyLmpzeCcpXG5cbnZhciBIZWFkZXIgPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdIZWFkZXInLFxuICBwcm9wVHlwZXM6IHtcbiAgICBiYWNrOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICAgIGxpbmtzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXksXG4gICAgYmFja1R5cGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgb25Mb2dvdXQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb25JbXBvcnQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgZ2V0RGF0YUR1bXA6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbiAgfSxcbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxpbmtzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBpY29uOiAnaGVscCcsXG4gICAgICAgICAgdGl0bGU6ICdQcm9ibGVtPycsXG4gICAgICAgICAgdXJsOiAnaHR0cHM6Ly9ubS1lcnJvcnMuaGVyb2t1YXBwLmNvbS9uZXcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBpY29uOiAnZ2l0aHViJyxcbiAgICAgICAgICB0aXRsZTogJ0NvbnRyaWJ1dGUnLCBcbiAgICAgICAgICB1cmw6ICdodHRwczovL25vdGFibGVtaW5kLmdpdGh1Yi5pbydcbiAgICAgICAgfSwge1xuICAgICAgICAgIGljb246ICdhYm91dCcsXG4gICAgICAgICAgdGl0bGU6ICdBYm91dCcsXG4gICAgICAgICAgdXJsOiAnaHR0cHM6Ly9ub3RhYmxlbWluZC5jb20nXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBiYWNrOiBudWxsLFxuICAgICAgYmFja1R5cGU6IG51bGwsXG4gICAgICBvbkNoYW5nZUJhY2s6IGZ1bmN0aW9uIChiYWNrLCB0eXBlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCd3YW50IHRvIGNoYW5nZSB0byB0eXBlOicsIGJhY2ssIHR5cGUpXG4gICAgICB9XG4gICAgfVxuICB9LFxuICBvbkNsaWNrRG93bmxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYSA9IHRoaXMucmVmcy5kb3dubG9hZF9saW5rLmdldERPTU5vZGUoKVxuICAgICAgLCBkYXRhID0gdGhpcy5wcm9wcy5nZXREYXRhRHVtcCgpXG4gICAgICAsIGJsb2IgPSBuZXcgQmxvYihbSlNPTi5zdHJpbmdpZnkoZGF0YSwgbnVsbCwgMildLFxuICAgICAgICAgICAgICAgICAgICAgICAge3R5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ30pXG4gICAgICAsIHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYilcbiAgICBhLmhyZWYgPSB1cmxcbiAgICBhLmRvd25sb2FkID0gJ25vdGFibGVtaW5kLWV4cG9ydC5qc29uJ1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcImhlYWRlclwifSwgXG4gICAgICAgIFJlYWN0LkRPTS5oMSgge2NsYXNzTmFtZTpcImhlYWRlcl90aXRsZVwifSwgXCJOb3RhYmxlbWluZFwiKSxcbiAgICAgICAgUmVhY3QuRE9NLnVsKCB7Y2xhc3NOYW1lOlwiaGVhZGVyX2xpbmtzXCJ9LCBcbiAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMucHJvcHMubGlua3MubWFwKGZ1bmN0aW9uIChsaW5rLCBpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgUmVhY3QuRE9NLmxpKCB7a2V5Oml9LCBcbiAgICAgICAgICAgICAgICAgIFJlYWN0LkRPTS5hKCB7Y2xhc3NOYW1lOlwiaGVhZGVyX2xpbmtcIixcbiAgICAgICAgICAgICAgICAgICAgIGhyZWY6bGluay51cmwsIHRhcmdldDpcIl9ibGFua1wiLFxuICAgICAgICAgICAgICAgICAgICAgdGl0bGU6bGluay50aXRsZX0sIFxuICAgICAgICAgICAgICAgICAgICBsaW5rLmljb24gJiYgZC5pKHtjbGFzc05hbWU6ICdmYSBmYS0nICsgbGluay5pY29ufSksXG4gICAgICAgICAgICAgICAgICAgIGxpbmsudGl0bGVcbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJoZWFkZXJfc3BhY2VyXCJ9KSxcbiAgICAgICAgSW1wb3J0ZXIoIHtidG5DbGFzc05hbWU6XCJoZWFkZXJfaW1wb3J0XCIsIG9uTG9hZDp0aGlzLnByb3BzLm9uSW1wb3J0fSksXG4gICAgICAgIFJlYWN0LkRPTS5hKCB7Y2xhc3NOYW1lOlwiaGVhZGVyX2Rvd25sb2FkXCIsXG4gICAgICAgICAgIHJlZjpcImRvd25sb2FkX2xpbmtcIixcbiAgICAgICAgICAgb25DbGljazp0aGlzLm9uQ2xpY2tEb3dubG9hZH0sIFxuICAgICAgICAgICAgUmVhY3QuRE9NLmkoIHtjbGFzc05hbWU6XCJmYSBmYS1kb3dubG9hZFwifSlcbiAgICAgICAgKSxcbiAgICAgICAgUmVhY3QuRE9NLmJ1dHRvbigge2NsYXNzTmFtZTpcImhlYWRlcl9sb2dvdXRcIiwgb25DbGljazp0aGlzLnByb3BzLm9uTG9nb3V0fSwgXG4gICAgICAgICAgXCJMb2dvdXRcIlxuICAgICAgICApXG4gICAgICAgIC8qPEJhY2tlbmRQaWNrZXIgY3VycmVudEJhY2s9e3RoaXMucHJvcHMuYmFja31cbiAgICAgICAgICBkcm9wZG93bj17dHJ1ZX1cbiAgICAgICAgICBiYWNrcz17dGhpcy5wcm9wcy5iYWNrc31cbiAgICAgICAgICBvblJlYWR5PXt0aGlzLnByb3BzLm9uQ2hhbmdlQmFja30vPiovXG4gICAgICApXG4gICAgKVxuICB9XG59KVxuXG4vLyB2aW06IHNldCB0YWJzdG9wPTIgc2hpZnR3aWR0aD0yIGV4cGFuZHRhYjpcblxuXG5pZiAod2luZG93LmZ1c2lvbikgd2luZG93LmZ1c2lvbi5yZWdpc3Rlcihtb2R1bGUuZXhwb3J0cywgXCIvVXNlcnMva2hhbmludGVybjEvY2xvbmUvbm90YWJsZW1pbmQvbGliL2hlYWRlci5qc3hcIiwgcmVxdWlyZShcIi9Vc2Vycy9raGFuaW50ZXJuMS9jbG9uZS9ub3RhYmxlbWluZC9saWIvaGVhZGVyLmpzb25cIikpO1xubW9kdWxlLmV4cG9ydHMuX2ZpbGVfb3JpZ2luID0gXCIvVXNlcnMva2hhbmludGVybjEvY2xvbmUvbm90YWJsZW1pbmQvbGliL2hlYWRlci5qc3hcIjsiLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cblxudmFyIEJhY2tQaWNrZXIgPSByZXF1aXJlKCcuL2JhY2tlbmQtcGlja2VyLmpzeCcpXG5cbnZhciBIZWxsbyA9IG1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ0hlbGxvJyxcbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGJhY2tzOiB7fSxcbiAgICAgIG9uUmVhZHk6IGZ1bmN0aW9uIChiYWNrLCB0eXBlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdiYWNrIHJlYWR5JywgYmFjaywgdHlwZSlcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwiaGVsbG9cIn0sIFxuICAgICAgICBSZWFjdC5ET00uaDEobnVsbCwgXCJOb3RhYmxlbWluZFwiKSxcbiAgICAgICAgQmFja1BpY2tlcigge29uUmVhZHk6dGhpcy5wcm9wcy5vblJlYWR5LCBiYWNrczp0aGlzLnByb3BzLmJhY2tzfSksXG4gICAgICAgIFJlYWN0LkRPTS51bChudWxsLCBcbiAgICAgICAgICBSZWFjdC5ET00ubGkobnVsbCwgXCJZb3Ugb3duIHlvdXIgZGF0YVwiKSxcbiAgICAgICAgICBSZWFjdC5ET00ubGkobnVsbCwgXCJGcmVlIGFuZCBvcGVuIHNvdXJjZVwiKSxcbiAgICAgICAgICBSZWFjdC5ET00ubGkobnVsbCwgXCJLZXlib2FyZCBvcHRpbWl6ZWRcIilcbiAgICAgICAgKSxcbiAgICAgICAgUmVhY3QuRE9NLmgzKG51bGwsIFwiUm9hZG1hcFwiKSxcbiAgICAgICAgUmVhY3QuRE9NLnVsKG51bGwsIFxuICAgICAgICAgIFJlYWN0LkRPTS5saShudWxsLCBcImdvb2dsZSBkcml2ZSBzeW5jXCIpLFxuICAgICAgICAgIFJlYWN0LkRPTS5saShudWxsLCBcImN1c3RvbSBzZXJ2ZXIgZm9yIGNvbGxhYm9yYXRpb25cIiksXG4gICAgICAgICAgUmVhY3QuRE9NLmxpKG51bGwsIFwid2hpdGVib2FyZFwiKVxuICAgICAgICApXG4gICAgICApXG4gICAgKVxuICB9XG59KVxuXG4vLyB2aW06IHNldCB0YWJzdG9wPTIgc2hpZnR3aWR0aD0yIGV4cGFuZHRhYjpcblxuXG5pZiAod2luZG93LmZ1c2lvbikgd2luZG93LmZ1c2lvbi5yZWdpc3Rlcihtb2R1bGUuZXhwb3J0cywgXCIvVXNlcnMva2hhbmludGVybjEvY2xvbmUvbm90YWJsZW1pbmQvbGliL2hlbGxvLmpzeFwiLCBmYWxzZSk7XG5tb2R1bGUuZXhwb3J0cy5fZmlsZV9vcmlnaW4gPSBcIi9Vc2Vycy9raGFuaW50ZXJuMS9jbG9uZS9ub3RhYmxlbWluZC9saWIvaGVsbG8uanN4XCI7IiwibW9kdWxlLmV4cG9ydHM9e1xuICBcInNpbXBsZVwiOiB7IH0sXG4gIFwiX3dyYXBTdGF0ZVwiOiB7XG4gICAgXCJwcm9wXCI6IFwiZmlsZVwiLFxuICAgIFwiY2FsbGJhY2tcIjogXCJvbkNoYW5nZVwiXG4gIH0sXG4gIFwiX2xvZ1wiOiBbXCJvbkxvYWRcIiwgXCJvbkNsb3NlXCJdLFxuICBcIl9zdHlsZVwiOiB7XG4gICAgXCJkaXNwbGF5XCI6IFwiYmxvY2tcIlxuICB9XG59XG5cbiIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXG52YXIgaXNWYWxpZEZvcm1hdCA9IHJlcXVpcmUoJy4vaXMtdmFsaWQtZm9ybWF0JylcblxudmFyIEltcG9ydFBvcG92ZXIgPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdJbXBvcnRQb3BvdmVyJyxcbiAgcHJvcFR5cGVzOiB7XG4gICAgZmlsZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgICBvbkNoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvbkxvYWQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb25DbG9zZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxuICB9LFxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBlcnJvcjogbnVsbCxcbiAgICAgIHJlYWRlcjogbnVsbFxuICAgIH1cbiAgfSxcbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24gKG5leHRQcm9wcykge1xuICAgIGlmICh0aGlzLnByb3BzLmZpbGUgIT09IG5leHRQcm9wcykge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZXJyb3I6IGZhbHNlfSlcbiAgICB9XG4gIH0sXG5cbiAgX29uU3VibWl0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcblxuICAgIHJlYWRlci5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHJlYWRlcjogbnVsbCxcbiAgICAgICAgZXJyb3I6ICdGYWlsZWQgdG8gbG9hZCBmaWxlLidcbiAgICAgIH0pXG4gICAgfS5iaW5kKHRoaXMpXG5cbiAgICByZWFkZXIub25hYm9ydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICByZWFkZXI6IG51bGwsXG4gICAgICAgIGVycm9yOiAnVXBsb2FkIGNhbmNlbGxlZCdcbiAgICAgIH0pXG4gICAgfS5iaW5kKHRoaXMpXG5cbiAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgdmFyIGRhdGFcbiAgICAgIHRyeSB7XG4gICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGV2dC50YXJnZXQucmVzdWx0KVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIHBhcnNlIGZpbGVcIiwgZSwgZXZ0LnRhcmdldC5yZXN1bHRzKVxuICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgcmVhZGVyOiBudWxsLFxuICAgICAgICAgIGVycm9yOiBuZXcgRXJyb3IoXCJJbnZhbGlkIGZvcm1hdC4gWW91IGNhbiBvbmx5IGltcG9ydCBmaWxlcyB0aGF0IHdlcmUgZXhwb3J0ZWQgZnJvbSBub3RhYmxlbWluZC5cIilcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc1ZhbGlkRm9ybWF0KGRhdGEpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICByZWFkZXI6IG51bGwsXG4gICAgICAgICAgZXJyb3I6IG5ldyBFcnJvcihcIkludmFsaWQgZm9ybWF0LiBZb3UgY2FuIG9ubHkgaW1wb3J0IGZpbGVzIHRoYXQgd2VyZSBleHBvcnRlZCBmcm9tIG5vdGFibGVtaW5kLlwiKVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgcmVhZGVyOiBudWxsLFxuICAgICAgICBlcnJvcjogbnVsbFxuICAgICAgfSlcblxuICAgICAgdGhpcy5wcm9wcy5vbkxvYWQodGhpcy5wcm9wcy5maWxlLm5hbWUsIGRhdGEsIHt9KVxuICAgIH0uYmluZCh0aGlzKVxuXG4gICAgcmVhZGVyLnJlYWRBc1RleHQodGhpcy5wcm9wcy5maWxlKVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWFkZXI6IHJlYWRlcixcbiAgICAgIGVycm9yOiBmYWxzZSxcbiAgICB9KVxuXG4gIH0sXG5cbiAgX29uQ2hhbmdlOiBmdW5jdGlvbiAoZSkge1xuICAgIHRoaXMucHJvcHMub25DaGFuZ2UoZS50YXJnZXQuZmlsZXNbMF0pXG4gIH0sXG4gIF9vblJlbW92ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucHJvcHMub25DaGFuZ2UobnVsbClcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcImltcG9ydC1wb3BvdmVyXCJ9LCBcbiAgICAgIFJlYWN0LkRPTS5oMygge2NsYXNzTmFtZTpcImltcG9ydC1wb3BvdmVyX3RpdGxlXCJ9LCBcbiAgICAgICAgXCJJbXBvcnQgaW50byBOb3RhYmxlbWluZFwiXG4gICAgICApLFxuICAgICAgUmVhY3QuRE9NLmJ1dHRvbigge29uQ2xpY2s6dGhpcy5wcm9wcy5vbkNsb3NlLCBjbGFzc05hbWU6XCJpbXBvcnQtcG9wb3Zlcl9jbG9zZVwifSksXG4gICAgICB0aGlzLmJvZHkoKVxuICAgIClcbiAgfSxcblxuICBib2R5OiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gbG9hZGluZ1xuICAgIGlmICh0aGlzLnN0YXRlLnJlYWRlcikge1xuICAgICAgcmV0dXJuIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJpbXBvcnQtcG9wb3Zlcl9sb2FkaW5nXCJ9LCBcbiAgICAgICAgUmVhY3QuRE9NLmkoIHtjbGFzc05hbWU6XCJmYSBmYS1zcGluIGZhLXNwaW5uZXJcIn0pLFxuICAgICAgICBSZWFjdC5ET00uc3Bhbigge2NsYXNzTmFtZTpcImltcG9ydC1wb3BvdmVyX2xvYWRpbmctdGV4dFwifSwgXG4gICAgICAgICAgXCJMb2FkaW5nXCJcbiAgICAgICAgKVxuICAgICAgKVxuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmZpbGUpIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJpbXBvcnQtcG9wb3Zlcl9maWxlXCJ9LCBcbiAgICAgICAgICBSZWFjdC5ET00uc3Bhbigge2NsYXNzTmFtZTpcImltcG9ydC1wb3BvdmVyX2ZpbGVuYW1lXCJ9LCB0aGlzLnByb3BzLmZpbGUubmFtZSksXG4gICAgICAgICAgUmVhY3QuRE9NLmJ1dHRvbihcbiAgICAgICAgICAgIHtvbkNsaWNrOnRoaXMuX29uUmVtb3ZlLFxuICAgICAgICAgICAgY2xhc3NOYW1lOlwiaW1wb3J0LXBvcG92ZXJfcmVtb3ZlXCJ9KVxuICAgICAgICApLFxuICAgICAgICB0aGlzLnN0YXRlLmVycm9yICYmIFJlYWN0LkRPTS5wKCB7Y2xhc3NOYW1lOlwiaW1wb3J0LXBvcG92ZXJfZXJyb3JcIn0sIHRoaXMuc3RhdGUuZXJyb3IubWVzc2FnZSksXG4gICAgICAgIFJlYWN0LkRPTS5idXR0b24oIHtjbGFzc05hbWU6XCJpbXBvcnQtcG9wb3Zlcl9zdWJtaXRcIiwgb25DbGljazp0aGlzLl9vblN1Ym1pdH0sIFwiSW1wb3J0XCIpXG4gICAgICBdXG4gICAgfVxuXG4gICAgcmV0dXJuIFtcbiAgICAgIFJlYWN0LkRPTS5wKCB7Y2xhc3NOYW1lOlwiaW1wb3J0LXBvcG92ZXJfdXBsb2FkLXRleHRcIn0sIFxuICAgICAgICBcIkRyYWcgYW5kIERyb3Agb3IgY2xpY2sgdG8gc2VsZWN0IGEgZmlsZS5cIlxuICAgICAgKSxcbiAgICAgIFJlYWN0LkRPTS5pbnB1dCgge3R5cGU6XCJmaWxlXCIsIG9uQ2hhbmdlOnRoaXMuX29uQ2hhbmdlfSlcbiAgICBdXG4gIH1cbn0pXG5cblxuaWYgKHdpbmRvdy5mdXNpb24pIHdpbmRvdy5mdXNpb24ucmVnaXN0ZXIobW9kdWxlLmV4cG9ydHMsIFwiL1VzZXJzL2toYW5pbnRlcm4xL2Nsb25lL25vdGFibGVtaW5kL2xpYi9pbXBvcnQtcG9wb3Zlci5qc3hcIiwgcmVxdWlyZShcIi9Vc2Vycy9raGFuaW50ZXJuMS9jbG9uZS9ub3RhYmxlbWluZC9saWIvaW1wb3J0LXBvcG92ZXIuanNvblwiKSk7XG5tb2R1bGUuZXhwb3J0cy5fZmlsZV9vcmlnaW4gPSBcIi9Vc2Vycy9raGFuaW50ZXJuMS9jbG9uZS9ub3RhYmxlbWluZC9saWIvaW1wb3J0LXBvcG92ZXIuanN4XCI7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG5cbnZhciBJbXBvcnRQb3BvdmVyID0gcmVxdWlyZSgnLi9pbXBvcnQtcG9wb3Zlci5qc3gnKVxuXG52YXIgSW1wb3J0ZXIgPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdJbXBvcnRlcicsXG4gIHByb3BUeXBlczoge1xuICAgIGJ0bkNsYXNzTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICBvbkxvYWQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbiAgfSxcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRyb3BwaW5nOiBmYWxzZSxcbiAgICAgIHNob3dpbmc6IGZhbHNlLFxuICAgICAgZmlsZTogbnVsbFxuICAgIH1cbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW50ZXInLCB0aGlzLl9vbkRyYWdPdmVyKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIHRoaXMuX29uRHJhZ092ZXIpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIHRoaXMuX29uRHJhZ0VuZClcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIHRoaXMuX29uRHJvcClcbiAgfSxcbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignZHJhZ2VudGVyJywgdGhpcy5fb25EcmFnT3ZlcilcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgdGhpcy5fb25EcmFnRW5kKVxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIHRoaXMuX29uRHJhZ092ZXIpXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCB0aGlzLl9vbkRyb3ApXG4gIH0sXG5cbiAgX29uRHJhZ092ZXI6IGZ1bmN0aW9uIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgdGhpcy5zZXRTdGF0ZSh7ZHJvcHBpbmc6IHRydWV9KVxuICAgIHJldHVybiBmYWxzZVxuICB9LFxuICBfb25EcmFnRW5kOiBmdW5jdGlvbiAoZSkge1xuICAgIGlmIChlLnRhcmdldC5jbGFzc05hbWUuaW5kZXhPZignaW1wb3J0X2Ryb3BwZXInKSAhPT0gLTEpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2Ryb3BwaW5nOiBmYWxzZX0pXG4gICAgfVxuICB9LFxuICBfb25Ecm9wOiBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICB2YXIgZmlsZSA9IGUuZGF0YVRyYW5zZmVyLmZpbGVzWzBdXG4gICAgdGhpcy5zZXRTdGF0ZSh7ZmlsZTogZmlsZSwgZHJvcHBpbmc6IGZhbHNlLCBzaG93aW5nOiB0cnVlfSlcbiAgICByZXR1cm4gZmFsc2VcbiAgfSxcblxuICBfb25TaG93OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7c2hvd2luZzogdHJ1ZX0pXG4gIH0sXG4gIF9vbkhpZGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtzaG93aW5nOiBmYWxzZX0pXG4gIH0sXG4gIF9vbkxvYWQ6IGZ1bmN0aW9uIChmaWxlbmFtZSwgZGF0YSwgb3B0aW9ucykge1xuICAgIHRoaXMuX29uSGlkZSgpXG4gICAgdGhpcy5wcm9wcy5vbkxvYWQoZmlsZW5hbWUsIGRhdGEsIG9wdGlvbnMpXG4gIH0sXG5cbiAgX29uQ2hhbmdlRmlsZTogZnVuY3Rpb24gKGZpbGUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtmaWxlOiBmaWxlfSlcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcImltcG9ydGVyXCJ9LCBcbiAgICAgIFJlYWN0LkRPTS5idXR0b24oIHtjbGFzc05hbWU6dGhpcy5wcm9wcy5idG5DbGFzc05hbWUsIG9uQ2xpY2s6dGhpcy5fb25TaG93fSwgXG4gICAgICAgIFJlYWN0LkRPTS5pKCB7Y2xhc3NOYW1lOlwiZmEgZmEtdXBsb2FkXCJ9KVxuICAgICAgKSxcbiAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJpbXBvcnRfZHJvcHBlclwiICsgKHRoaXMuc3RhdGUuZHJvcHBpbmcgPyAnIGRyb3BwaW5nJyA6ICcnKX0pLFxuICAgICAgdGhpcy5zdGF0ZS5zaG93aW5nICYmIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJpbXBvcnRlcl9iYWNrXCIsIG9uQ2xpY2s6dGhpcy5fb25IaWRlfSksXG4gICAgICB0aGlzLnN0YXRlLnNob3dpbmcgJiYgdGhpcy5wb3BvdmVyKClcbiAgICApXG4gIH0sXG5cbiAgcG9wb3ZlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBJbXBvcnRQb3BvdmVyKHtcbiAgICAgIGZpbGU6IHRoaXMuc3RhdGUuZmlsZSxcbiAgICAgIG9uQ2xvc2U6IHRoaXMuX29uSGlkZSxcbiAgICAgIG9uQ2hhbmdlOiB0aGlzLl9vbkNoYW5nZUZpbGUsXG4gICAgICBvbkxvYWQ6IHRoaXMuX29uTG9hZFxuICAgIH0pXG4gIH1cbn0pXG5cblxuaWYgKHdpbmRvdy5mdXNpb24pIHdpbmRvdy5mdXNpb24ucmVnaXN0ZXIobW9kdWxlLmV4cG9ydHMsIFwiL1VzZXJzL2toYW5pbnRlcm4xL2Nsb25lL25vdGFibGVtaW5kL2xpYi9pbXBvcnRlci5qc3hcIiwgZmFsc2UpO1xubW9kdWxlLmV4cG9ydHMuX2ZpbGVfb3JpZ2luID0gXCIvVXNlcnMva2hhbmludGVybjEvY2xvbmUvbm90YWJsZW1pbmQvbGliL2ltcG9ydGVyLmpzeFwiOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXG52YXIgSGVsbG9QYWdlID0gcmVxdWlyZSgnLi9oZWxsby5qc3gnKVxuICAsIE1haW5BcHAgPSByZXF1aXJlKCcuL21haW4nKVxuICAsIEhlYWRlciA9IHJlcXVpcmUoJy4vaGVhZGVyLmpzeCcpXG4gICwgSW1wb3J0ZXIgPSByZXF1aXJlKCcuL2ltcG9ydGVyLmpzeCcpXG5cbiAgLCBNb2RlbCA9IHJlcXVpcmUoJ3RyZWVkL3NraW5zL3dvcmtmbG93eS9tb2RlbCcpXG4gICwgQ29udHJvbGxlciA9IHJlcXVpcmUoJ3RyZWVkL3NraW5zL3dvcmtmbG93eS9jb250cm9sbGVyJylcblxuICAsIGxvYWRNb2RlbCA9IHJlcXVpcmUoJy4vbG9hZC1tb2RlbCcpXG5cbnZhciBOb3RhYmxlTWluZCA9IG1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ05vdGFibGVNaW5kJyxcbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGJhY2tzOiB7fVxuICAgIH1cbiAgfSxcblxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYmFja1R5cGU6IG51bGwsXG4gICAgICBsb2FkaW5nTW9kZWw6IGZhbHNlLFxuICAgICAgbW9kZWw6IG51bGwsXG4gICAgICBubTogbnVsbFxuICAgIH1cbiAgfSxcblxuICBvbkNoYW5nZUJhY2s6IGZ1bmN0aW9uIChiYWNrLCBiYWNrVHlwZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbG9hZGluZ01vZGVsOiB0cnVlLFxuICAgICAgYmFja1R5cGU6IGJhY2tUeXBlXG4gICAgfSlcblxuICAgIGxvYWRNb2RlbChiYWNrLCBNb2RlbCwgZnVuY3Rpb24gKGVyciwgbW9kZWwpIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGxvYWRpbmdNb2RlbDogZmFsc2UsXG4gICAgICAgICAgbW9kZWxFcnJvcjogZXJyLFxuICAgICAgICAgIG1vZGVsOiBudWxsLFxuICAgICAgICAgIG5tOiBudWxsXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHZhciBubSA9IHdpbmRvdy5jb250cm9sbGVyID0gbmV3IENvbnRyb2xsZXIobW9kZWwpXG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBsb2FkaW5nTW9kZWw6IGZhbHNlLFxuICAgICAgICBtb2RlbEVycm9yOiBudWxsLFxuICAgICAgICBtb2RlbDogbW9kZWwsXG4gICAgICAgIG5tOiBubVxuICAgICAgfSlcbiAgICB9LmJpbmQodGhpcykpXG4gIH0sXG5cbiAgZ2V0RGF0YUR1bXA6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5ubS5leHBvcnREYXRhKClcbiAgfSxcblxuICBfb25Mb2dvdXQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5ubSkge1xuICAgICAgdGhpcy5zdGF0ZS5ubS5kZXN0cm95KClcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7bm06IG51bGwsIGJhY2tUeXBlOiBudWxsfSlcbiAgICBsb2NhbFN0b3JhZ2UuX25vdGFibGVtaW5kX2JhY2tlbmQgPSBudWxsXG4gIH0sXG5cbiAgX29uQ2xpY2tJbXBvcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGltcG9ydGluZzogdHJ1ZVxuICAgIH0pXG4gIH0sXG5cbiAgLy8gZmlsZW5hbWU6IHN0cmluZ1xuICAvLyBkYXRhOiBsb29rIGF0IG1vZGVsLmltcG9ydERhdGEgZm9yIG1vcmUgaW5mb1xuICAvLyBvcHRpb25zOlxuICAvLyAtIG5vdCBzdXJlIGFib3V0IG9wdGlvbnMganVzdCB5ZXQuXG4gIF9vbkxvYWRJbXBvcnQ6IGZ1bmN0aW9uIChmaWxlbmFtZSwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgdmFyIG5vdyA9IG5ldyBEYXRlKClcbiAgICAgICwgbmFtZSA9ICdJbXBvcnRlZCBvbiAnICsgbm93LnRvTG9jYWxlRGF0ZVN0cmluZygpICtcbiAgICAgICAgICAgICAgICcgYXQgJyArIG5vdy50b0xvY2FsZVRpbWVTdHJpbmcoKSArXG4gICAgICAgICAgICAgICAnIGZyb20gJyArIGZpbGVuYW1lXG5cbiAgICB0aGlzLnN0YXRlLm5tLmltcG9ydERhdGEoe1xuICAgICAgZGF0YToge1xuICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICBkb25lOiBmYWxzZVxuICAgICAgfSxcbiAgICAgIGNvbGxhcHNlZDogZmFsc2UsXG4gICAgICBjaGlsZHJlbjogW2RhdGFdXG4gICAgfSlcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5sb2FkaW5nTW9kZWwpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJub3RhYmxlbWluZFwifSwgXG4gICAgICAgICAgXCJMb2FkaW5nLi4uXCJcbiAgICAgICAgKVxuICAgICAgKVxuICAgIH1cbiAgICBpZiAoIXRoaXMuc3RhdGUubm0pIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJub3RhYmxlbWluZFwifSwgXG4gICAgICAgICAgSGVsbG9QYWdlKCB7b25SZWFkeTp0aGlzLm9uQ2hhbmdlQmFjaywgYmFja3M6dGhpcy5wcm9wcy5iYWNrc30pXG4gICAgICAgIClcbiAgICAgIClcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcIm5vdGFibGVtaW5kXCJ9LCBcbiAgICAgICAgSGVhZGVyKCB7YmFjazp0aGlzLnN0YXRlLm5tLm1vZGVsLmRiLFxuICAgICAgICAgIGJhY2tUeXBlOnRoaXMuc3RhdGUuYmFja1R5cGUsXG4gICAgICAgICAgYmFja3M6dGhpcy5wcm9wcy5iYWNrcyxcbiAgICAgICAgICBvbkxvZ291dDp0aGlzLl9vbkxvZ291dCxcbiAgICAgICAgICBvbkltcG9ydDp0aGlzLl9vbkxvYWRJbXBvcnQsXG4gICAgICAgICAgZ2V0RGF0YUR1bXA6dGhpcy5nZXREYXRhRHVtcH0pLFxuICAgICAgICBNYWluQXBwKFxuICAgICAgICAgICAge3JlZjpcImFwcFwiLFxuICAgICAgICAgICAgbm06dGhpcy5zdGF0ZS5ubX0pXG4gICAgICApXG4gICAgKVxuICB9XG59KVxuXG4vLyB2aW06IHNldCB0YWJzdG9wPTIgc2hpZnR3aWR0aD0yIGV4cGFuZHRhYjpcblxuXG5pZiAod2luZG93LmZ1c2lvbikgd2luZG93LmZ1c2lvbi5yZWdpc3Rlcihtb2R1bGUuZXhwb3J0cywgXCIvVXNlcnMva2hhbmludGVybjEvY2xvbmUvbm90YWJsZW1pbmQvbGliL2luZGV4LmpzeFwiLCBmYWxzZSk7XG5tb2R1bGUuZXhwb3J0cy5fZmlsZV9vcmlnaW4gPSBcIi9Vc2Vycy9raGFuaW50ZXJuMS9jbG9uZS9ub3RhYmxlbWluZC9saWIvaW5kZXguanN4XCI7IiwiXG4vLyBpbml0aWFsaXplIHRoZSBkYXRhYmFzZSwgZ2V0dGluZyBhbGwgdGhlIGRhdGEgb3V0IG9mIGl0IHRvIGdpdmUgdG8gdGhlXG4vLyBtb2RlbFxuLy8gZG9uZShlcnIsIHJvb3RpZCwgbm9kZXMpXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChkYiwgZG9uZSkge1xuICBkYi5maW5kQWxsKCdyb290JywgZnVuY3Rpb24gKGVyciwgcm9vdHMpIHtcbiAgICBpZiAoZXJyKSByZXR1cm4gZG9uZShlcnIpXG5cbiAgICBpZiAoIXJvb3RzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGxvYWREZWZhdWx0KGRiLCBkb25lKVxuICAgIH1cblxuICAgIGRiLmZpbmRBbGwoJ25vZGUnLCBmdW5jdGlvbiAoZXJyLCBub2Rlcykge1xuICAgICAgaWYgKGVycikgcmV0dXJuIGRvbmUobmV3IEVycm9yKCdGYWlsZWQgdG8gbG9hZCBpdGVtcycpKVxuICAgICAgaWYgKCFub2Rlcy5sZW5ndGgpIHJldHVybiBkb25lKG5ldyBFcnJvcihcIkRhdGEgY29ycnVwdGVkIC0gY291bGQgbm90IGZpbmQgcm9vdCBub2RlXCIpKVxuXG4gICAgICB2YXIgbWFwID0ge31cbiAgICAgICAgLCBpZCA9IHJvb3RzWzBdLmlkXG4gICAgICBmb3IgKHZhciBpPTA7IGk8bm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbWFwW25vZGVzW2ldLmlkXSA9IG5vZGVzW2ldXG4gICAgICB9XG4gICAgICBkb25lKG51bGwsIGlkLCBtYXApXG4gICAgfSlcbiAgfSlcbn1cblxudmFyIFJPT1RfSUQgPSA1MFxuXG5mdW5jdGlvbiBsb2FkRGVmYXVsdChkYiwgZG9uZSkge1xuXG4gIC8vIGxvYWQgZGVmYXVsdFxuICBkYi5zYXZlKCdyb290JywgUk9PVF9JRCwge2lkOiBST09UX0lEfSwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBtYXAgPSB7fVxuICAgIG1hcFtST09UX0lEXSA9IHtcbiAgICAgIGlkOiBST09UX0lELFxuICAgICAgY2hpbGRyZW46IFtdLFxuICAgICAgY29sbGFwc2VkOiBmYWxzZSxcbiAgICAgIGRhdGE6IHtuYW1lOiAnSG9tZSd9LFxuICAgICAgZGVwdGg6IDBcbiAgICB9XG5cbiAgICBkYi5zYXZlKCdub2RlJywgUk9PVF9JRCwgbWFwW1JPT1RfSURdLCBmdW5jdGlvbiAoKSB7XG4gICAgICBkb25lKG51bGwsIFJPT1RfSUQsIG1hcClcbiAgICB9KVxuICB9KVxuXG59XG5cbiIsIlxudmFyIGlzVmFsaWRGb3JtYXQgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gIGlmICghZGF0YS5kYXRhIHx8ICdzdHJpbmcnICE9PSB0eXBlb2YgZGF0YS5kYXRhLm5hbWUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICBpZiAoZGF0YS5jaGlsZHJlbikge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShkYXRhLmNoaWxkcmVuKSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIGZvciAodmFyIGk9MDsgaTxkYXRhLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoIWlzVmFsaWRGb3JtYXQoZGF0YS5jaGlsZHJlbltpXSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlXG59XG5cbiIsIlxudmFyIGluaXREYiA9IHJlcXVpcmUoJy4vaW5pdC1kYicpXG5cbi8vIGRiOiBhIGJhY2tlbmRcbi8vIE1vZGVsOiB0aGUgbW9kZWwgY2xhc3Ncbi8vIGRvbmUoZXJyLCBtb2RlbClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGRiLCBNb2RlbCwgZG9uZSkge1xuICBpbml0RGIoZGIsIGZ1bmN0aW9uIChlcnIsIGlkLCBub2Rlcykge1xuICAgIGlmIChlcnIpIHJldHVybiBkb25lKGVycilcbiAgICB2YXIgbW9kZWwgPSB3aW5kb3cubW9kZWwgPSBuZXcgTW9kZWwoaWQsIG5vZGVzLCBkYilcbiAgICBkb25lKG51bGwsIG1vZGVsKVxuICB9KVxufVxuXG4iLCJcbnZhciBIaXN0b3J5ID0gcmVxdWlyZSgndHJlZWQvc2tpbnMvd29ya2Zsb3d5L2hpc3RvcnknKVxuICAsIFdyYXBwZXIgPSByZXF1aXJlKCd0cmVlZC9za2lucy93b3JrZmxvd3kvd3JhcCcpXG4gICwgZCA9IFJlYWN0LkRPTVxuXG4vLyBtYW5hZ2UgbGluZWFnZSwgY3JlYXRlIGFuZCBpbml0aWFsaXplIG1vZGVsIGluc3RhbmNlLiBJdCBvd25zIHRoZSBzdGF0ZSBmb3Jcbi8vIHRoZSBtb2RlbC5cbnZhciBNYWluQXBwID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnTWFpblBhZ2UnLFxuICBwcm9wVHlwZXM6IHtcbiAgICBubTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG4gIH0sXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBsaW5lYWdlOiBbXSxcbiAgICB9XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnByb3BzLm5tLm9uKCdidWxsZXQnLCB0aGlzLnVwZGF0ZUJyZWFkKVxuICAgIHRoaXMucHJvcHMubm0ucmVmcmVzaEJ1bGxldCgpXG4gIH0sXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uIChuZXh0UHJvcHMpIHtcbiAgICBpZiAobmV4dFByb3BzLm5tICE9PSB0aGlzLnByb3BzLm5tKSB7XG4gICAgICBuZXh0UHJvcHMubm0ub24oJ2J1bGxldCcsIHRoaXMudXBkYXRlQnJlYWQpXG4gICAgICBuZXh0UHJvcHMubm0ucmVmcmVzaEJ1bGxldCgpXG4gICAgICB0aGlzLnByb3BzLm5tLm9mZignYnVsbGV0JywgdGhpcy51cGRhdGVCcmVhZClcbiAgICB9XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5wcm9wcy5ubS5vZmYoJ2J1bGxldCcsIHRoaXMudXBkYXRlQnJlYWQpXG4gIH0sXG5cbiAgY2hhbmdlQnJlYWQ6IGZ1bmN0aW9uIChpZCkge1xuICAgIHRoaXMucHJvcHMubm0uYWN0aW9ucy5jbGlja0J1bGxldChpZClcbiAgfSxcbiAgdXBkYXRlQnJlYWQ6IGZ1bmN0aW9uIChsaW5lYWdlKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7bGluZWFnZTogbGluZWFnZX0pXG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGQuZGl2KHtcbiAgICAgIGNsYXNzTmFtZTogJ3dvcmtmbG93bWUnXG4gICAgfSwgSGlzdG9yeSh7XG4gICAgICAgICBpdGVtczogdGhpcy5zdGF0ZS5saW5lYWdlLFxuICAgICAgICAgb25DbGljazogdGhpcy5jaGFuZ2VCcmVhZCxcbiAgICAgICB9KSxcbiAgICAgICBXcmFwcGVyKHtcbiAgICAgICAgIHJlZjogJ3dmJyxcbiAgICAgICAgIGNvbnRyb2xsZXI6IHRoaXMucHJvcHMubm0sXG4gICAgICAgICBvbkJyZWFkQ3J1bWI6IHRoaXMudXBkYXRlQnJlYWRcbiAgICAgIH0pXG4gICAgKVxuICB9XG59KVxuXG5cblxuaWYgKHdpbmRvdy5mdXNpb24pIHdpbmRvdy5mdXNpb24ucmVnaXN0ZXIobW9kdWxlLmV4cG9ydHMsIFwiL1VzZXJzL2toYW5pbnRlcm4xL2Nsb25lL25vdGFibGVtaW5kL2xpYi9tYWluLmpzXCIsIGZhbHNlKTtcbm1vZHVsZS5leHBvcnRzLl9maWxlX29yaWdpbiA9IFwiL1VzZXJzL2toYW5pbnRlcm4xL2Nsb25lL25vdGFibGVtaW5kL2xpYi9tYWluLmpzXCI7IiwiXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNob3dpbmc6IGZhbHNlXG4gICAgfVxuICB9LFxuICBjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uIChwcm9wcywgc3RhdGUpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5zaG93aW5nID09PSBzdGF0ZS5zaG93aW5nKSByZXR1cm5cbiAgICBpZiAodGhpcy5zdGF0ZS5zaG93aW5nKSB7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5vbkhpZGUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm9uSGlkZSlcbiAgICB9XG4gIH0sXG4gIG9uU2hvdzogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe3Nob3dpbmc6IHRydWV9KVxuICB9LFxuICBvbkhpZGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHtzaG93aW5nOiBmYWxzZX0pXG4gIH1cbn1cblxuIiwiXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2VOb2RlXG5cbnZhciBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJylcbiAgLCB1dGlsID0gcmVxdWlyZSgnLi91dGlsJylcblxuZnVuY3Rpb24gQmFzZU5vZGUoZGF0YSwgb3B0aW9ucywgaXNOZXcpIHtcbiAgdGhpcy5uYW1lID0gZGF0YS5uYW1lXG4gIHRoaXMuaXNOZXcgPSBpc05ld1xuICB0aGlzLm8gPSBvcHRpb25zXG4gIHRoaXMuby5rZXliaW5kaW5ncyA9IHV0aWwubWVyZ2UodGhpcy5kZWZhdWx0X2tleXMsIG9wdGlvbnMua2V5cylcblxuICB0aGlzLmVkaXRpbmcgPSBmYWxzZVxuICB0aGlzLnNldHVwTm9kZSgpO1xufVxuXG5CYXNlTm9kZS5hZGRBY3Rpb24gPSBmdW5jdGlvbiAobmFtZSwgYmluZGluZywgZnVuYykge1xuICBpZiAoIXRoaXMuZXh0cmFfYWN0aW9ucykge1xuICAgIHRoaXMuZXh0cmFfYWN0aW9ucyA9IHt9XG4gIH1cbiAgdGhpcy5leHRyYV9hY3Rpb25zW25hbWVdID0ge1xuICAgIGJpbmRpbmc6IGJpbmRpbmcsXG4gICAgZnVuYzogZnVuY1xuICB9XG59XG5cbkJhc2VOb2RlLnByb3RvdHlwZSA9IHtcbiAgLy8gcHVibGljXG4gIHN0YXJ0RWRpdGluZzogZnVuY3Rpb24gKGZyb21TdGFydCkge1xuICB9LFxuICBzdG9wRWRpdGluZzogZnVuY3Rpb24gKCkge1xuICB9LFxuICBhZGRFZGl0VGV4dDogZnVuY3Rpb24gKHRleHQpIHtcbiAgfSxcbiAgc2V0RGF0YTogZnVuY3Rpb24gKGRhdGEpIHtcbiAgfSxcbiAgc2V0QXR0cjogZnVuY3Rpb24gKGF0dHIsIHZhbHVlKSB7XG4gIH0sXG5cbiAgLy8gcHJvdGV4dGVkXG4gIGlzQXRTdGFydDogZnVuY3Rpb24gKCkge1xuICB9LFxuICBpc0F0RW5kOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIGlzQXRCb3R0b206IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgaXNBdFRvcDogZnVuY3Rpb24gKCkge1xuICB9LFxuXG4gIHNldHVwTm9kZTogZnVuY3Rpb24gKCkge1xuICB9LFxuICBzZXRJbnB1dFZhbHVlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgfSxcbiAgZ2V0SW5wdXRWYWx1ZTogZnVuY3Rpb24gKCkge1xuICB9LFxuICBzZXRUZXh0Q29udGVudDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gIH0sXG4gIGdldFNlbGVjdGlvblBvc2l0aW9uOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG5cblxuICAvLyBTaG91bGQgdGhlcmUgYmUgYSBjYW5TdG9wRWRpdGluZz9cbiAgZm9jdXM6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnN0YXJ0RWRpdGluZygpO1xuICB9LFxuICBibHVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zdG9wRWRpdGluZygpO1xuICB9LFxuICBcbiAga2V5SGFuZGxlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBhY3Rpb25zID0ge31cbiAgICAgICwgbmFtZVxuICAgIGZvciAobmFtZSBpbiB0aGlzLm8ua2V5YmluZGluZ3MpIHtcbiAgICAgIGFjdGlvbnNbdGhpcy5vLmtleWJpbmRpbmdzW25hbWVdXSA9IHRoaXMuYWN0aW9uc1tuYW1lXVxuICAgIH1cblxuICAgIGlmICh0aGlzLmV4dHJhX2FjdGlvbnMpIHtcbiAgICAgIGZvciAobmFtZSBpbiB0aGlzLmV4dHJhX2FjdGlvbnMpIHtcbiAgICAgICAgaWYgKCFhY3Rpb25zW25hbWVdKSB7XG4gICAgICAgICAgYWN0aW9uc1t0aGlzLmV4dHJhX2FjdGlvbnNbbmFtZV0uYmluZGluZ10gPSB0aGlzLmV4dHJhX2FjdGlvbnNbbmFtZV0uYWN0aW9uXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ga2V5cyhhY3Rpb25zKS5iaW5kKHRoaXMpXG4gIH0sXG5cblxuICBkZWZhdWx0X2tleXM6IHtcbiAgICAndW5kbyc6ICdjdHJsK3onLFxuICAgICdyZWRvJzogJ2N0cmwrc2hpZnQreicsXG4gICAgJ2NvbGxhcHNlJzogJ2FsdCtsZWZ0JyxcbiAgICAndW5jb2xsYXBzZSc6ICdhbHQrcmlnaHQnLFxuICAgICdkZWRlbnQnOiAnc2hpZnQrdGFiLCBzaGlmdCthbHQrbGVmdCcsXG4gICAgJ2luZGVudCc6ICd0YWIsIHNoaWZ0K2FsdCtyaWdodCcsXG4gICAgJ21vdmUgdXAnOiAnc2hpZnQrYWx0K3VwJyxcbiAgICAnbW92ZSBkb3duJzogJ3NoaWZ0K2FsdCtkb3duJyxcbiAgICAndXAnOiAndXAnLFxuICAgICdkb3duJzogJ2Rvd24nLFxuICAgICdsZWZ0JzogJ2xlZnQnLFxuICAgICdyaWdodCc6ICdyaWdodCcsXG4gICAgJ2FkZCBhZnRlcic6ICdyZXR1cm4nLFxuICAgICdpbnNlcnQgcmV0dXJuJzogJ3NoaWZ0K3JldHVybicsXG4gICAgJ21lcmdlIHVwJzogJ2JhY2tzcGFjZScsXG4gICAgJ3N0b3AgZWRpdGluZyc6ICdlc2NhcGUnLFxuICB9LFxuXG4gIGFjdGlvbnM6IHtcbiAgICAndW5kbyc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuby51bmRvKClcbiAgICB9LFxuICAgICdyZWRvJzogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5vLnJlZG8oKVxuICAgIH0sXG4gICAgJ2NvbGxhcHNlJzogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5vLnRvZ2dsZUNvbGxhcHNlKHRydWUpXG4gICAgfSxcbiAgICAndW5jb2xsYXBzZSc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuby50b2dnbGVDb2xsYXBzZShmYWxzZSlcbiAgICB9LFxuICAgICdkZWRlbnQnOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLm8ubW92ZUxlZnQoKVxuICAgIH0sXG4gICAgJ2luZGVudCc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuby5tb3ZlUmlnaHQoKVxuICAgIH0sXG4gICAgJ21vdmUgdXAnOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLm8ubW92ZVVwKClcbiAgICB9LFxuICAgICdtb3ZlIGRvd24nOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLm8ubW92ZURvd24oKVxuICAgIH0sXG4gICAgJ3VwJzogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMuaXNBdFRvcCgpKSB7XG4gICAgICAgIHRoaXMuby5nb1VwKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH0sXG4gICAgJ2Rvd24nOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5pc0F0Qm90dG9tKCkpIHtcbiAgICAgICAgdGhpcy5vLmdvRG93bigpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH0sXG4gICAgJ2xlZnQnOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5pc0F0U3RhcnQoKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5vLmdvVXAoKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9LFxuICAgICdyaWdodCc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLmlzQXRFbmQoKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5vLmdvRG93bih0cnVlKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9LFxuICAgICdpbnNlcnQgcmV0dXJuJzogZnVuY3Rpb24gKGUpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfSxcbiAgICAnYWRkIGFmdGVyJzogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNzID0gdGhpcy5nZXRTZWxlY3Rpb25Qb3NpdGlvbigpXG4gICAgICAgICwgbmFtZSA9IHRoaXMuZ2V0SW5wdXRWYWx1ZSgpXG4gICAgICAgICwgcmVzdCA9IG51bGxcbiAgICAgIGlmIChuYW1lLmluZGV4T2YoJ1xcbicpICE9PSAtMSkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgICAgaWYgKHNzIDwgbmFtZS5sZW5ndGgpIHtcbiAgICAgICAgcmVzdCA9IG5hbWUuc2xpY2Uoc3MpXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWUuc2xpY2UoMCwgc3MpXG4gICAgICAgIHRoaXMuc2V0SW5wdXRWYWx1ZSh0aGlzLm5hbWUpXG4gICAgICAgIHRoaXMuc2V0VGV4dENvbnRlbnQodGhpcy5uYW1lKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZVxuICAgICAgICB0aGlzLnNldElucHV0VmFsdWUodGhpcy5uYW1lKVxuICAgICAgICB0aGlzLnNldFRleHRDb250ZW50KHRoaXMubmFtZSlcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5pc05ldykgdGhpcy5vLmNoYW5nZWQoJ25hbWUnLCB0aGlzLm5hbWUpXG4gICAgICB0aGlzLm8uYWRkQWZ0ZXIocmVzdClcbiAgICB9LFxuICAgIC8vIG9uIGJhY2tzcGFjZVxuICAgICdtZXJnZSB1cCc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB2YWx1ZSA9IHRoaXMuZ2V0SW5wdXRWYWx1ZSgpXG4gICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm8ucmVtb3ZlKClcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmlzQXRTdGFydCgpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm8ucmVtb3ZlKHZhbHVlKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9LFxuICAgICdzdG9wIGVkaXRpbmcnOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnN0b3BFZGl0aW5nKCk7XG4gICAgfVxuICB9LFxufVxuXG4iLCJcbnZhciBjb21tYW5kcyA9IHJlcXVpcmUoJy4vY29tbWFuZHMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbW1hbmRlZ2VyXG5cbmZ1bmN0aW9uIG1ha2VDb21tYW5kKHR5cGUsIGFyZ3MpIHtcbiAgdmFyIG5hbWVzID0gY29tbWFuZHNbdHlwZV0uYXJnc1xuICAgICwgZGF0YSA9IHt9XG4gIGZvciAodmFyIGk9MDsgaTxuYW1lcy5sZW5ndGg7IGkrKykge1xuICAgIGRhdGFbbmFtZXNbaV1dID0gYXJnc1tpXVxuICB9XG4gIHJldHVybiB7dHlwZTogdHlwZSwgZGF0YTogZGF0YX1cbn1cblxuZnVuY3Rpb24gQ29tbWFuZGVnZXIodmlldywgbW9kZWwpIHtcbiAgdGhpcy5jb21tYW5kcyA9IFtdXG4gIHRoaXMuaGlzdHBvcyA9IDBcbiAgdGhpcy52aWV3ID0gdmlld1xuICB0aGlzLmxpc3RlbmVycyA9IHt9XG4gIHRoaXMud29ya2luZyA9IGZhbHNlXG4gIHRoaXMubW9kZWwgPSBtb2RlbFxufVxuXG5Db21tYW5kZWdlci5wcm90b3R5cGUgPSB7XG4gIC8qKlxuICAgKiBZb3UgY2FuIHBhc3MgaW4gYW55IG51bWJlciBvZiB0eXBlLCBhcmdzIHBhaXJzLlxuICAgKiBFeDogZXhlY3V0ZUNvbW1hbmRzKHQxLCBhMSwgdDIsIGEyLCAuLi4pXG4gICAqL1xuICBleGVjdXRlQ29tbWFuZHM6IGZ1bmN0aW9uICh0eXBlLCBhcmdzKSB7XG4gICAgaWYgKHRoaXMud29ya2luZykgcmV0dXJuXG4gICAgdmFyIGNtZHMgPSBbXTtcbiAgICBmb3IgKHZhciBpPTA7IGk8YXJndW1lbnRzLmxlbmd0aDsgaSs9Mikge1xuICAgICAgY21kcy5wdXNoKG1ha2VDb21tYW5kKGFyZ3VtZW50c1tpXSwgYXJndW1lbnRzW2krMV0pKVxuICAgIH1cbiAgICBpZiAodGhpcy5oaXN0cG9zID4gMCkge1xuICAgICAgdGhpcy5jb21tYW5kcyA9IHRoaXMuY29tbWFuZHMuc2xpY2UoMCwgLXRoaXMuaGlzdHBvcylcbiAgICAgIHRoaXMuaGlzdHBvcyA9IDBcbiAgICB9XG4gICAgdGhpcy5jb21tYW5kcy5wdXNoKGNtZHMpXG4gICAgZm9yICh2YXIgaT0wOyBpPGNtZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuZG9Db21tYW5kKGNtZHNbaV0pXG4gICAgfVxuICAgIHRoaXMudHJpZ2dlcignY2hhbmdlJylcbiAgfSxcbiAgdHJpZ2dlcjogZnVuY3Rpb24gKHdoYXQpIHtcbiAgICBmb3IgKHZhciBpdGVtIGluIHRoaXMubGlzdGVuZXJzW3doYXRdKSB7XG4gICAgICB0aGlzLmxpc3RlbmVyc1t3aGF0XVtpdGVtXS5hcHBseShudWxsLCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpXG4gICAgfVxuICB9LFxuICBvbjogZnVuY3Rpb24gKHdoYXQsIGNiKSB7XG4gICAgaWYgKCF0aGlzLmxpc3RlbmVyc1t3aGF0XSkge1xuICAgICAgdGhpcy5saXN0ZW5lcnNbd2hhdF0gPSBbXVxuICAgIH1cbiAgICB0aGlzLmxpc3RlbmVyc1t3aGF0XS5wdXNoKGNiKVxuICB9LFxuICB1bmRvOiBmdW5jdGlvbiAoKSB7XG4gICAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKClcbiAgICB2YXIgcG9zID0gdGhpcy5oaXN0cG9zID8gdGhpcy5oaXN0cG9zICsgMSA6IDFcbiAgICAgICwgaXggPSB0aGlzLmNvbW1hbmRzLmxlbmd0aCAtIHBvc1xuICAgIGlmIChpeCA8IDApIHtcbiAgICAgIHJldHVybiBmYWxzZSAvLyBubyBtb3JlIHVuZG8hXG4gICAgfVxuICAgIHZhciBjbWRzID0gdGhpcy5jb21tYW5kc1tpeF1cbiAgICBmb3IgKHZhciBpPWNtZHMubGVuZ3RoLTE7IGk+PTA7IGktLSkge1xuICAgICAgdGhpcy51bmRvQ29tbWFuZChjbWRzW2ldKVxuICAgIH1cbiAgICB0aGlzLmhpc3Rwb3MgKz0gMVxuICAgIHRoaXMudHJpZ2dlcignY2hhbmdlJylcbiAgICByZXR1cm4gdHJ1ZVxuICB9LFxuICByZWRvOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBvcyA9IHRoaXMuaGlzdHBvcyA/IHRoaXMuaGlzdHBvcyAtIDEgOiAtMVxuICAgICAgLCBpeCA9IHRoaXMuY29tbWFuZHMubGVuZ3RoIC0gMSAtIHBvc1xuICAgIGlmIChpeCA+PSB0aGlzLmNvbW1hbmRzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGZhbHNlIC8vIG5vIG1vcmUgdG8gcmVkbyFcbiAgICB9XG4gICAgdmFyIGNtZHMgPSB0aGlzLmNvbW1hbmRzW2l4XVxuICAgIGZvciAodmFyIGk9MDsgaTxjbWRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLnJlZG9Db21tYW5kKGNtZHNbaV0pXG4gICAgfVxuICAgIHRoaXMuaGlzdHBvcyAtPSAxXG4gICAgdGhpcy50cmlnZ2VyKCdjaGFuZ2UnKVxuICAgIHJldHVybiB0cnVlXG4gIH0sXG4gIGRvQ29tbWFuZDogZnVuY3Rpb24gKGNtZCkge1xuICAgIHRoaXMud29ya2luZyA9IHRydWVcbiAgICBjb21tYW5kc1tjbWQudHlwZV0uYXBwbHkuY2FsbChjbWQuZGF0YSwgdGhpcy52aWV3LCB0aGlzLm1vZGVsKVxuICAgIHRoaXMud29ya2luZyA9IGZhbHNlXG4gIH0sXG4gIHVuZG9Db21tYW5kOiBmdW5jdGlvbiAoY21kKSB7XG4gICAgdGhpcy53b3JraW5nID0gdHJ1ZVxuICAgIGNvbW1hbmRzW2NtZC50eXBlXS51bmRvLmNhbGwoY21kLmRhdGEsIHRoaXMudmlldywgdGhpcy5tb2RlbClcbiAgICB0aGlzLndvcmtpbmcgPSBmYWxzZVxuICB9LFxuICByZWRvQ29tbWFuZDogZnVuY3Rpb24gKGNtZCkge1xuICAgIHRoaXMud29ya2luZyA9IHRydWVcbiAgICB2YXIgYyA9IGNvbW1hbmRzW2NtZC50eXBlXVxuICAgIDsoYy5yZWRvIHx8IGMuYXBwbHkpLmNhbGwoY21kLmRhdGEsIHRoaXMudmlldywgdGhpcy5tb2RlbClcbiAgICB0aGlzLndvcmtpbmcgPSBmYWxzZVxuICB9LFxufVxuXG4iLCJcbmZ1bmN0aW9uIGNvcHkob25lKSB7XG4gIGlmICgnb2JqZWN0JyAhPT0gdHlwZW9mIG9uZSkgcmV0dXJuIG9uZVxuICB2YXIgdHdvID0ge31cbiAgZm9yICh2YXIgbmFtZSBpbiBvbmUpIHtcbiAgICB0d29bbmFtZV0gPSBvbmVbbmFtZV1cbiAgfVxuICByZXR1cm4gdHdvXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjb2xsYXBzZToge1xuICAgIGFyZ3M6IFsnaWQnLCAnZG9Db2xsYXBzZSddLFxuICAgIGFwcGx5OiBmdW5jdGlvbiAodmlldywgbW9kZWwpIHtcbiAgICAgIG1vZGVsLnNldENvbGxhcHNlZCh0aGlzLmlkLCB0aGlzLmRvQ29sbGFwc2UpXG4gICAgICB2aWV3LnNldENvbGxhcHNlZCh0aGlzLmlkLCB0aGlzLmRvQ29sbGFwc2UpXG4gICAgICB2aWV3LmdvVG8odGhpcy5pZClcbiAgICB9LFxuICAgIHVuZG86IGZ1bmN0aW9uICh2aWV3LCBtb2RlbCkge1xuICAgICAgbW9kZWwuc2V0Q29sbGFwc2VkKHRoaXMuaWQsICF0aGlzLmRvQ29sbGFwc2UpXG4gICAgICB2aWV3LnNldENvbGxhcHNlZCh0aGlzLmlkLCAhdGhpcy5kb0NvbGxhcHNlKVxuICAgICAgdmlldy5nb1RvKHRoaXMuaWQpXG4gICAgfSxcbiAgfSxcbiAgbmV3Tm9kZToge1xuICAgIGFyZ3M6IFsncGlkJywgJ2luZGV4JywgJ3RleHQnXSxcbiAgICBhcHBseTogZnVuY3Rpb24gKHZpZXcsIG1vZGVsKSB7XG4gICAgICB2YXIgY3IgPSBtb2RlbC5jcmVhdGUodGhpcy5waWQsIHRoaXMuaW5kZXgsIHRoaXMudGV4dClcbiAgICAgIHRoaXMuaWQgPSBjci5ub2RlLmlkXG4gICAgICB2aWV3LmFkZChjci5ub2RlLCBjci5iZWZvcmUpXG4gICAgICAvLyB2aWV3LnN0YXJ0RWRpdGluZyhjci5ub2RlLmlkKVxuICAgIH0sXG4gICAgdW5kbzogZnVuY3Rpb24gKHZpZXcsIG1vZGVsKSB7XG4gICAgICB2YXIgZWQgPSB2aWV3LmVkaXRpbmdcbiAgICAgIHZpZXcucmVtb3ZlKHRoaXMuaWQpXG4gICAgICB0aGlzLnNhdmVkID0gbW9kZWwucmVtb3ZlKHRoaXMuaWQpXG4gICAgICB2YXIgbmlkID0gbW9kZWwuaWRzW3RoaXMucGlkXS5jaGlsZHJlblt0aGlzLmluZGV4LTFdXG4gICAgICBpZiAobmlkID09PSB1bmRlZmluZWQpIG5pZCA9IHRoaXMucGlkXG4gICAgICBpZiAoZWQpIHtcbiAgICAgICAgdmlldy5zdGFydEVkaXRpbmcobmlkKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmlldy5zZXRBY3RpdmUobmlkKVxuICAgICAgfVxuICAgIH0sXG4gICAgcmVkbzogZnVuY3Rpb24gKHZpZXcsIG1vZGVsKSB7XG4gICAgICB2YXIgYmVmb3JlID0gbW9kZWwucmVhZGQodGhpcy5zYXZlZClcbiAgICAgIHZpZXcuYWRkKHRoaXMuc2F2ZWQubm9kZSwgYmVmb3JlKVxuICAgIH1cbiAgfSxcbiAgYXBwZW5kVGV4dDoge1xuICAgIGFyZ3M6IFsnaWQnLCAndGV4dCddLFxuICAgIGFwcGx5OiBmdW5jdGlvbiAodmlldywgbW9kZWwpIHtcbiAgICAgIHRoaXMub2xkdGV4dCA9IG1vZGVsLmlkc1t0aGlzLmlkXS5kYXRhLm5hbWVcbiAgICAgIG1vZGVsLmFwcGVuZFRleHQodGhpcy5pZCwgdGhpcy50ZXh0KVxuICAgICAgdmlldy5hcHBlbmRUZXh0KHRoaXMuaWQsIHRoaXMudGV4dClcbiAgICB9LFxuICAgIHVuZG86IGZ1bmN0aW9uICh2aWV3LCBtb2RlbCkge1xuICAgICAgbW9kZWwuc2V0QXR0cih0aGlzLmlkLCAnbmFtZScsIHRoaXMub2xkdGV4dClcbiAgICAgIHZpZXcuc2V0QXR0cih0aGlzLmlkLCAnbmFtZScsIHRoaXMub2xkdGV4dClcbiAgICB9XG4gIH0sXG4gIGNoYW5nZU5vZGVBdHRyOiB7XG4gICAgYXJnczogWydpZCcsICdhdHRyJywgJ3ZhbHVlJ10sXG4gICAgYXBwbHk6IGZ1bmN0aW9uICh2aWV3LCBtb2RlbCkge1xuICAgICAgdGhpcy5vbGR2YWx1ZSA9IGNvcHkobW9kZWwuaWRzW3RoaXMuaWRdLmRhdGFbdGhpcy5hdHRyXSlcbiAgICAgIG1vZGVsLnNldEF0dHIodGhpcy5pZCwgdGhpcy5hdHRyLCB0aGlzLnZhbHVlKVxuICAgICAgdmlldy5zZXRBdHRyKHRoaXMuaWQsIHRoaXMuYXR0ciwgdGhpcy52YWx1ZSlcbiAgICAgIHZpZXcuZ29Ubyh0aGlzLmlkKVxuICAgIH0sXG4gICAgdW5kbzogZnVuY3Rpb24gKHZpZXcsIG1vZGVsKSB7XG4gICAgICBtb2RlbC5zZXRBdHRyKHRoaXMuaWQsIHRoaXMuYXR0ciwgdGhpcy5vbGR2YWx1ZSlcbiAgICAgIHZpZXcuc2V0QXR0cih0aGlzLmlkLCB0aGlzLmF0dHIsIHRoaXMub2xkdmFsdWUpXG4gICAgICB2aWV3LmdvVG8odGhpcy5pZClcbiAgICB9XG4gIH0sXG4gIGNoYW5nZU5vZGU6IHtcbiAgICBhcmdzOiBbJ2lkJywgJ25ld2RhdGEnXSxcbiAgICBhcHBseTogZnVuY3Rpb24gKHZpZXcsIG1vZGVsKSB7XG4gICAgICB0aGlzLm9sZGRhdGEgPSBjb3B5KG1vZGVsLmlkc1t0aGlzLmlkXS5kYXRhKVxuICAgICAgbW9kZWwuc2V0RGF0YSh0aGlzLmlkLCB0aGlzLm5ld2RhdGEpXG4gICAgICB2aWV3LnNldERhdGEodGhpcy5pZCwgdGhpcy5uZXdkYXRhKVxuICAgICAgdmlldy5nb1RvKHRoaXMuaWQpXG4gICAgfSxcbiAgICB1bmRvOiBmdW5jdGlvbiAodmlldywgbW9kZWwpIHtcbiAgICAgIG1vZGVsLnNldERhdGEodGhpcy5pZCwgdGhpcy5vbGRkYXRhKVxuICAgICAgdmlldy5zZXREYXRhKHRoaXMuaWQsIHRoaXMub2xkZGF0YSlcbiAgICAgIHZpZXcuZ29Ubyh0aGlzLmlkKVxuICAgIH1cbiAgfSxcbiAgcmVtb3ZlOiB7XG4gICAgYXJnczogWydpZCddLFxuICAgIGFwcGx5OiBmdW5jdGlvbiAodmlldywgbW9kZWwpIHtcbiAgICAgIHZhciBiZWxvdyA9IG1vZGVsLm5leHRTaWJsaW5nKHRoaXMuaWQpXG4gICAgICBpZiAodW5kZWZpbmVkID09PSBiZWxvdykgYmVsb3cgPSBtb2RlbC5pZEFib3ZlKHRoaXMuaWQpXG4gICAgICB2aWV3LnJlbW92ZSh0aGlzLmlkKVxuICAgICAgdGhpcy5zYXZlZCA9IG1vZGVsLnJlbW92ZSh0aGlzLmlkKVxuICAgICAgdmlldy5zdGFydEVkaXRpbmcoYmVsb3cpXG4gICAgfSxcbiAgICB1bmRvOiBmdW5jdGlvbiAodmlldywgbW9kZWwpIHtcbiAgICAgIHZhciBiZWZvcmUgPSBtb2RlbC5yZWFkZCh0aGlzLnNhdmVkKVxuICAgICAgdmlldy5hZGRUcmVlKHRoaXMuc2F2ZWQubm9kZSwgYmVmb3JlKVxuICAgIH1cbiAgfSxcbiAgY29weToge1xuICAgIGFyZ3M6IFsnaWRzJ10sXG4gICAgYXBwbHk6IGZ1bmN0aW9uICh2aWV3LCBtb2RlbCkge1xuICAgICAgdmFyIGl0ZW1zID0gdGhpcy5pZHMubWFwKGZ1bmN0aW9uIChpZCkge1xuICAgICAgICByZXR1cm4gbW9kZWwuZHVtcERhdGEoaWQsIHRydWUpXG4gICAgICB9KVxuICAgICAgbW9kZWwuY2xpcGJvYXJkID0gaXRlbXNcbiAgICB9LFxuICAgIHVuZG86IGZ1bmN0aW9uICh2aWV3LCBtb2RlbCkge1xuICAgIH1cbiAgfSxcbiAgY3V0OiB7XG4gICAgYXJnczogWydpZHMnXSxcbiAgICBhcHBseTogZnVuY3Rpb24gKHZpZXcsIG1vZGVsKSB7XG4gICAgICB2YXIgaXRlbXMgPSB0aGlzLmlkcy5tYXAoZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHZpZXcucmVtb3ZlKGlkKVxuICAgICAgICByZXR1cm4gbW9kZWwuZHVtcERhdGEoaWQsIHRydWUpXG4gICAgICB9KVxuICAgICAgbW9kZWwuY2xpcGJvYXJkID0gaXRlbXNcblxuICAgICAgdmFyIGlkID0gdGhpcy5pZHNbdGhpcy5pZHMubGVuZ3RoLTFdXG4gICAgICB2YXIgYmVsb3cgPSBtb2RlbC5uZXh0U2libGluZyhpZClcbiAgICAgIGlmICh1bmRlZmluZWQgPT09IGJlbG93KSBiZWxvdyA9IG1vZGVsLmlkQWJvdmUodGhpcy5pZHNbMF0pXG4gICAgICB0aGlzLnNhdmVkID0gdGhpcy5pZHMubWFwKGZ1bmN0aW9uIChpZCkge1xuICAgICAgICByZXR1cm4gbW9kZWwucmVtb3ZlKGlkKVxuICAgICAgfSlcblxuICAgICAgaWYgKHZpZXcuZWRpdGluZykge1xuICAgICAgICB2aWV3LnN0YXJ0RWRpdGluZyhiZWxvdylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZpZXcuc2V0QWN0aXZlKGJlbG93KVxuICAgICAgfVxuICAgIH0sXG4gICAgdW5kbzogZnVuY3Rpb24gKHZpZXcsIG1vZGVsKSB7XG4gICAgICB2YXIgYmVmb3JlXG4gICAgICBmb3IgKHZhciBpPXRoaXMuc2F2ZWQubGVuZ3RoLTE7IGk+PTA7IGktLSkge1xuICAgICAgICBiZWZvcmUgPSBtb2RlbC5yZWFkZCh0aGlzLnNhdmVkW2ldKVxuICAgICAgICB2aWV3LmFkZFRyZWUodGhpcy5zYXZlZFtpXS5ub2RlLCBiZWZvcmUpXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5pZHMubGVuZ3RoID4gMSkge1xuICAgICAgICB2aWV3LnNldFNlbGVjdGlvbih0aGlzLmlkcylcbiAgICAgICAgdmlldy5zZXRBY3RpdmUodGhpcy5pZHNbdGhpcy5pZHMubGVuZ3RoLTFdKVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgaW1wb3J0RGF0YToge1xuICAgIGFyZ3M6IFsncGlkJywgJ2luZGV4JywgJ2RhdGEnXSxcbiAgICBhcHBseTogZnVuY3Rpb24gKHZpZXcsIG1vZGVsKSB7XG4gICAgICB2YXIgcGlkID0gdGhpcy5waWRcbiAgICAgICAgLCBpbmRleCA9IHRoaXMuaW5kZXhcbiAgICAgICAgLCBlZCA9IHZpZXcuZWRpdGluZ1xuICAgICAgICAsIGl0ZW0gPSB0aGlzLmRhdGFcbiAgICAgIHZhciBjciA9IG1vZGVsLmNyZWF0ZU5vZGVzKHBpZCwgaW5kZXgsIGl0ZW0pXG4gICAgICB2aWV3LmFkZFRyZWUoY3Iubm9kZSwgY3IuYmVmb3JlKVxuICAgICAgdmlldy5zZXRDb2xsYXBzZWQoY3Iubm9kZS5wYXJlbnQsIGZhbHNlKVxuICAgICAgbW9kZWwuc2V0Q29sbGFwc2VkKGNyLm5vZGUucGFyZW50LCBmYWxzZSlcbiAgICAgIHRoaXMubmV3aWQgPSBjci5ub2RlLmlkXG4gICAgICBpZiAoZWQpIHtcbiAgICAgICAgdmlldy5zdGFydEVkaXRpbmcodGhpcy5uZXdpZHNbMF0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2aWV3LnNldEFjdGl2ZSh0aGlzLm5ld2lkc1swXSlcbiAgICAgIH1cbiAgICB9LFxuICAgIHVuZG86IGZ1bmN0aW9uICh2aWV3LCBtb2RlbCkge1xuICAgICAgdmFyIGlkID0gdGhpcy5uZXdpZFxuICAgICAgdmFyIGJlbG93ID0gbW9kZWwubmV4dFNpYmxpbmcoaWQpXG4gICAgICBpZiAodW5kZWZpbmVkID09PSBiZWxvdykgYmVsb3cgPSBtb2RlbC5pZEFib3ZlKGlkKVxuICAgICAgdmlldy5yZW1vdmUoaWQpXG4gICAgICB0aGlzLnNhdmVkID0gbW9kZWwucmVtb3ZlKGlkKVxuICAgICAgaWYgKHZpZXcuZWRpdGluZykge1xuICAgICAgICB2aWV3LnN0YXJ0RWRpdGluZyhiZWxvdylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZpZXcuc2V0QWN0aXZlKGJlbG93KVxuICAgICAgfVxuICAgICAgLy8gdmlldy5yZW1vdmUodGhpcy5uZXdpZClcbiAgICAgIC8vIHRoaXMuc2F2ZWQgPSBtb2RlbC5yZW1vdmUodGhpcy5uZXdpZClcbiAgICAgIG1vZGVsLmNsaXBib2FyZCA9IHRoaXMuc2F2ZWRcbiAgICB9LFxuICAgIHJlZG86IGZ1bmN0aW9uICh2aWV3LCBtb2RlbCkge1xuICAgICAgLy8gdmFyIGJlZm9yZSA9IG1vZGVsLnJlYWRkKHRoaXMuc2F2ZWQpXG4gICAgICAvLyB2aWV3LmFkZFRyZWUodGhpcy5zYXZlZC5ub2RlLCBiZWZvcmUpXG4gICAgICB2YXIgYmVmb3JlID0gbW9kZWwucmVhZGQodGhpcy5zYXZlZClcbiAgICAgIHZpZXcuYWRkVHJlZShpdGVtLm5vZGUsIGJlZm9yZSlcbiAgICB9XG4gIH0sXG4gIHBhc3RlOiB7XG4gICAgYXJnczogWydwaWQnLCAnaW5kZXgnXSxcbiAgICBhcHBseTogZnVuY3Rpb24gKHZpZXcsIG1vZGVsKSB7XG4gICAgICB2YXIgcGlkID0gdGhpcy5waWRcbiAgICAgICAgLCBpbmRleCA9IHRoaXMuaW5kZXhcbiAgICAgICAgLCBlZCA9IHZpZXcuZWRpdGluZ1xuICAgICAgdmFyIGlkcyA9IG1vZGVsLmNsaXBib2FyZC5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgdmFyIGNyID0gbW9kZWwuY3JlYXRlTm9kZXMocGlkLCBpbmRleCwgaXRlbSlcbiAgICAgICAgdmlldy5hZGRUcmVlKGNyLm5vZGUsIGNyLmJlZm9yZSlcbiAgICAgICAgdmlldy5zZXRDb2xsYXBzZWQoY3Iubm9kZS5wYXJlbnQsIGZhbHNlKVxuICAgICAgICBtb2RlbC5zZXRDb2xsYXBzZWQoY3Iubm9kZS5wYXJlbnQsIGZhbHNlKVxuICAgICAgICBpbmRleCArPSAxXG4gICAgICAgIHJldHVybiBjci5ub2RlLmlkXG4gICAgICB9KVxuICAgICAgdGhpcy5uZXdpZHMgPSBpZHNcbiAgICAgIGlmIChpZHMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgaWYgKGVkKSB7XG4gICAgICAgICAgdmlldy5zdGFydEVkaXRpbmcodGhpcy5uZXdpZHNbMF0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmlldy5zZXRBY3RpdmUodGhpcy5uZXdpZHNbMF0pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZpZXcuc2V0U2VsZWN0aW9uKGlkcylcbiAgICAgICAgdmlldy5zZXRBY3RpdmUoaWRzW2lkcy5sZW5ndGgtMV0pXG4gICAgICB9XG4gICAgfSxcbiAgICB1bmRvOiBmdW5jdGlvbiAodmlldywgbW9kZWwpIHtcbiAgICAgIHZhciBpZCA9IHRoaXMubmV3aWRzW3RoaXMubmV3aWRzLmxlbmd0aC0xXVxuICAgICAgdmFyIGJlbG93ID0gbW9kZWwubmV4dFNpYmxpbmcoaWQpXG4gICAgICBpZiAodW5kZWZpbmVkID09PSBiZWxvdykgYmVsb3cgPSBtb2RlbC5pZEFib3ZlKHRoaXMubmV3aWRzWzBdKVxuICAgICAgdGhpcy5zYXZlZCA9IHRoaXMubmV3aWRzLm1hcChmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgdmlldy5yZW1vdmUoaWQpXG4gICAgICAgIHJldHVybiBtb2RlbC5yZW1vdmUoaWQpXG4gICAgICB9KVxuICAgICAgaWYgKHZpZXcuZWRpdGluZykge1xuICAgICAgICB2aWV3LnN0YXJ0RWRpdGluZyhiZWxvdylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZpZXcuc2V0QWN0aXZlKGJlbG93KVxuICAgICAgfVxuICAgICAgLy8gdmlldy5yZW1vdmUodGhpcy5uZXdpZClcbiAgICAgIC8vIHRoaXMuc2F2ZWQgPSBtb2RlbC5yZW1vdmUodGhpcy5uZXdpZClcbiAgICAgIG1vZGVsLmNsaXBib2FyZCA9IHRoaXMuc2F2ZWRcbiAgICB9LFxuICAgIHJlZG86IGZ1bmN0aW9uICh2aWV3LCBtb2RlbCkge1xuICAgICAgLy8gdmFyIGJlZm9yZSA9IG1vZGVsLnJlYWRkKHRoaXMuc2F2ZWQpXG4gICAgICAvLyB2aWV3LmFkZFRyZWUodGhpcy5zYXZlZC5ub2RlLCBiZWZvcmUpXG4gICAgICB0aGlzLnNhdmVkLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICB2YXIgYmVmb3JlID0gbW9kZWwucmVhZGQoaXRlbSlcbiAgICAgICAgdmlldy5hZGRUcmVlKGl0ZW0ubm9kZSwgYmVmb3JlKVxuICAgICAgfSlcbiAgICB9XG4gIH0sXG4gIG1vdmU6IHtcbiAgICBhcmdzOiBbJ2lkJywgJ3BpZCcsICdpbmRleCddLFxuICAgIGFwcGx5OiBmdW5jdGlvbiAodmlldywgbW9kZWwpIHtcbiAgICAgIHRoaXMub3BpZCA9IG1vZGVsLmlkc1t0aGlzLmlkXS5wYXJlbnRcbiAgICAgIHRoaXMub2luZGV4ID0gbW9kZWwuaWRzW3RoaXMub3BpZF0uY2hpbGRyZW4uaW5kZXhPZih0aGlzLmlkKVxuICAgICAgdmFyIGJlZm9yZSA9IG1vZGVsLm1vdmUodGhpcy5pZCwgdGhpcy5waWQsIHRoaXMuaW5kZXgpXG4gICAgICB2YXIgcGFyZW50ID0gbW9kZWwuaWRzW3RoaXMub3BpZF1cbiAgICAgICAgLCBsYXN0Y2hpbGQgPSBwYXJlbnQuY2hpbGRyZW4ubGVuZ3RoID09PSAwXG4gICAgICB2aWV3Lm1vdmUodGhpcy5pZCwgdGhpcy5waWQsIGJlZm9yZSwgdGhpcy5vcGlkLCBsYXN0Y2hpbGQpXG4gICAgICB2aWV3LmdvVG8odGhpcy5pZClcbiAgICB9LFxuICAgIHVuZG86IGZ1bmN0aW9uICh2aWV3LCBtb2RlbCkge1xuICAgICAgdmFyIGJlZm9yZSA9IG1vZGVsLm1vdmUodGhpcy5pZCwgdGhpcy5vcGlkLCB0aGlzLm9pbmRleClcbiAgICAgICAgLCBsYXN0Y2hpbGQgPSBtb2RlbC5pZHNbdGhpcy5waWRdLmNoaWxkcmVuLmxlbmd0aCA9PT0gMFxuICAgICAgdmlldy5tb3ZlKHRoaXMuaWQsIHRoaXMub3BpZCwgYmVmb3JlLCB0aGlzLnBpZCwgbGFzdGNoaWxkKVxuICAgICAgdmlldy5nb1RvKHRoaXMuaWQpXG4gICAgfVxuICB9XG59XG5cbiIsIlxubW9kdWxlLmV4cG9ydHMgPSBDb250cm9sbGVyXG5cbnZhciBWaWV3ID0gcmVxdWlyZSgnLi92aWV3JylcbiAgLCBDb21tYW5kZWdlciA9IHJlcXVpcmUoJy4vY29tbWFuZGVnZXInKVxuICAsIERlZmF1bHROb2RlID0gcmVxdWlyZSgnLi9kZWZhdWx0LW5vZGUnKVxuICAsIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKVxuXG4gICwgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpXG5cbmZ1bmN0aW9uIENvbnRyb2xsZXIobW9kZWwsIG8pIHtcbiAgbyA9IG8gfHwge3ZpZXdPcHRpb25zOiB7fX1cbiAgdGhpcy5vID0gdXRpbC5leHRlbmQoe1xuICAgIFZpZXc6IFZpZXcsXG4gIH0sIG8pXG4gIHRoaXMuby52aWV3T3B0aW9ucyA9IHV0aWwuZXh0ZW5kKHtcbiAgICBub2RlOiBEZWZhdWx0Tm9kZVxuICB9LCBvLnZpZXdPcHRpb25zKVxuICB0aGlzLm1vZGVsID0gbW9kZWxcbiAgdGhpcy52aWV3ID0gbmV3IHRoaXMuby5WaWV3KFxuICAgIHRoaXMuYmluZEFjdGlvbnMuYmluZCh0aGlzKSxcbiAgICB0aGlzLm1vZGVsLCB0aGlzLFxuICAgIHRoaXMuby52aWV3T3B0aW9uc1xuICApXG4gIHRoaXMubm9kZSA9IHRoaXMudmlldy5pbml0aWFsaXplKG1vZGVsLnJvb3QpXG4gIHRoaXMuY21kID0gbmV3IENvbW1hbmRlZ2VyKHRoaXMudmlldywgdGhpcy5tb2RlbClcblxuICB2YXIgYWN0aW9ucyA9IHt9XG4gIGZvciAodmFyIG5hbWUgaW4gdGhpcy5hY3Rpb25zKSB7XG4gICAgaWYgKCdzdHJpbmcnID09PSB0eXBlb2YgdGhpcy5hY3Rpb25zW25hbWVdKSBhY3Rpb25zW25hbWVdID0gdGhpcy5hY3Rpb25zW25hbWVdXG4gICAgZWxzZSBhY3Rpb25zW25hbWVdID0gdGhpcy5hY3Rpb25zW25hbWVdLmJpbmQodGhpcylcbiAgfVxuICB0aGlzLmFjdGlvbnMgPSBhY3Rpb25zXG4gIHRoaXMubGlzdGVuZXJzID0ge31cbiAgLy8gY29ubmVjdCB0aGUgdHdvLlxufVxuXG5Db250cm9sbGVyLnByb3RvdHlwZSA9IHtcbiAgdW5kbzogZnVuY3Rpb24gKCkge3RoaXMuY21kLnVuZG8oKX0sXG4gIHJlZG86IGZ1bmN0aW9uICgpIHt0aGlzLmNtZC5yZWRvKCl9LFxuICBvbjogZnVuY3Rpb24gKGV2dCwgZnVuYykge1xuICAgIGlmICghdGhpcy5saXN0ZW5lcnNbZXZ0XSkge1xuICAgICAgdGhpcy5saXN0ZW5lcnNbZXZ0XSA9IFtdXG4gICAgfVxuICAgIHRoaXMubGlzdGVuZXJzW2V2dF0ucHVzaChmdW5jKVxuICB9LFxuICBvZmY6IGZ1bmN0aW9uIChldnQsIGZ1bmMpIHtcbiAgICBpZiAoIXRoaXMubGlzdGVuZXJzW2V2dF0pIHJldHVybiBmYWxzZVxuICAgIHZhciBpID0gdGhpcy5saXN0ZW5lcnNbZXZ0XS5pbmRleE9mKGZ1bmMpXG4gICAgaWYgKGkgPT09IC0xKSByZXR1cm4gZmFsc2VcbiAgICB0aGlzLmxpc3RlbmVyc1tldnRdLnNwbGljZShpLCAxKVxuICAgIHJldHVybiB0cnVlXG4gIH0sXG4gIHRyaWdnZXI6IGZ1bmN0aW9uIChldnQpIHtcbiAgICBpZiAoIXRoaXMubGlzdGVuZXJzW2V2dF0pIHJldHVyblxuICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgZm9yICh2YXIgaT0wOyBpPHRoaXMubGlzdGVuZXJzW2V2dF0ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMubGlzdGVuZXJzW2V2dF1baV0uYXBwbHkobnVsbCwgYXJncylcbiAgICB9XG4gIH0sXG5cbiAgYmluZEFjdGlvbnM6IGZ1bmN0aW9uIChpZCkge1xuICAgIHZhciBhY3Rpb25zID0ge31cbiAgICAgICwgdmFsXG4gICAgZm9yICh2YXIgYWN0aW9uIGluIHRoaXMuYWN0aW9ucykge1xuICAgICAgdmFsID0gdGhpcy5hY3Rpb25zW2FjdGlvbl1cbiAgICAgIGlmICgnc3RyaW5nJyA9PT0gdHlwZW9mIHZhbCkge1xuICAgICAgICB2YWwgPSB0aGlzW3ZhbF1bYWN0aW9uXS5iaW5kKHRoaXNbdmFsXSwgaWQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWwgPSB2YWwuYmluZCh0aGlzLCBpZClcbiAgICAgIH1cbiAgICAgIGFjdGlvbnNbYWN0aW9uXSA9IHZhbFxuICAgIH1cbiAgICByZXR1cm4gYWN0aW9uc1xuICB9LFxuXG4gIGltcG9ydERhdGE6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5tb2RlbC5jcmVhdGVOb2Rlcyh0aGlzLnZpZXcuZ2V0QWN0aXZlKCksIDAsIGRhdGEpXG4gICAgdGhpcy52aWV3LnJlYmFzZSh0aGlzLnZpZXcucm9vdClcbiAgfSxcblxuICBleHBvcnREYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMubW9kZWwuZHVtcERhdGEodGhpcy5tb2RlbC5yb290LCB0cnVlKVxuICB9LFxuXG4gIGV4ZWN1dGVDb21tYW5kczogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuY21kLmV4ZWN1dGVDb21tYW5kcy5hcHBseSh0aGlzLmNtZCwgYXJndW1lbnRzKVxuICB9LFxuXG4gIC8vIHB1YmxpY1xuICBzZXRDb2xsYXBzZWQ6IGZ1bmN0aW9uIChpZCwgZG9Db2xsYXBzZSkge1xuICAgIGlmICghdGhpcy5tb2RlbC5oYXNDaGlsZHJlbihpZCkpIHJldHVyblxuICAgIGlmICh0aGlzLm1vZGVsLmlzQ29sbGFwc2VkKGlkKSA9PT0gZG9Db2xsYXBzZSkgcmV0dXJuXG4gICAgdGhpcy5leGVjdXRlQ29tbWFuZHMoJ2NvbGxhcHNlJywgW2lkLCBkb0NvbGxhcHNlXSk7XG4gIH0sXG4gIGFkZEJlZm9yZTogZnVuY3Rpb24gKGlkLCB0ZXh0KSB7XG4gICAgdmFyIG53ID0gdGhpcy5tb2RlbC5pZE5ldyhpZCwgdHJ1ZSlcbiAgICB0aGlzLmV4ZWN1dGVDb21tYW5kcygnbmV3Tm9kZScsIFtudy5waWQsIG53LmluZGV4LCB0ZXh0XSlcbiAgfSxcblxuICBhY3Rpb25zOiB7XG4gICAgdHJpZ2dlcjogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy50cmlnZ2VyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICB9LFxuICAgIGdvVXA6IGZ1bmN0aW9uIChpZCkge1xuICAgICAgaWYgKGlkID09PSB0aGlzLnZpZXcucm9vdCkgcmV0dXJuXG4gICAgICBpZiAoaWQgPT09ICduZXcnKSByZXR1cm4gdGhpcy52aWV3LmdvVG8odGhpcy52aWV3LnJvb3QpXG4gICAgICAvLyBzaG91bGQgSSBjaGVjayB0byBzZWUgaWYgaXQncyBvaz9cbiAgICAgIHZhciBhYm92ZSA9IHRoaXMubW9kZWwuaWRBYm92ZShpZClcbiAgICAgIGlmIChhYm92ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm5cbiAgICAgIHRoaXMudmlldy5zdGFydEVkaXRpbmcoYWJvdmUpO1xuICAgIH0sXG4gICAgZ29Eb3duOiBmdW5jdGlvbiAoaWQsIGZyb21TdGFydCkge1xuICAgICAgaWYgKGlkID09PSAnbmV3JykgcmV0dXJuIHRoaXMudmlldy5nb1RvKHRoaXMudmlldy5yb290KVxuICAgICAgdmFyIGJlbG93ID0gdGhpcy5tb2RlbC5pZEJlbG93KGlkLCB0aGlzLnZpZXcucm9vdClcbiAgICAgIGlmIChiZWxvdyA9PT0gdW5kZWZpbmVkKSByZXR1cm5cbiAgICAgIHRoaXMudmlldy5zdGFydEVkaXRpbmcoYmVsb3csIGZyb21TdGFydCk7XG4gICAgfSxcbiAgICBnb0xlZnQ6IGZ1bmN0aW9uIChpZCkge1xuICAgICAgaWYgKGlkID09PSAnbmV3JykgcmV0dXJuIHRoaXMudmlldy5nb1RvKHRoaXMudmlldy5yb290KVxuICAgICAgaWYgKGlkID09PSB0aGlzLnZpZXcucm9vdCkgcmV0dXJuXG4gICAgICB2YXIgcGFyZW50ID0gdGhpcy5tb2RlbC5nZXRQYXJlbnQoaWQpXG4gICAgICBpZiAoIXBhcmVudCkgcmV0dXJuXG4gICAgICB0aGlzLnZpZXcuc3RhcnRFZGl0aW5nKHBhcmVudClcbiAgICB9LFxuICAgIGdvUmlnaHQ6IGZ1bmN0aW9uIChpZCkge1xuICAgICAgaWYgKGlkID09PSAnbmV3JykgcmV0dXJuIHRoaXMudmlldy5nb1RvKHRoaXMudmlldy5yb290KVxuICAgICAgdmFyIGNoaWxkID0gdGhpcy5tb2RlbC5nZXRDaGlsZChpZClcbiAgICAgIGlmICghY2hpbGQpIHJldHVyblxuICAgICAgdGhpcy52aWV3LnN0YXJ0RWRpdGluZyhjaGlsZClcbiAgICB9LFxuICAgIHN0YXJ0TW92aW5nOiBmdW5jdGlvbiAoaWQpIHtcbiAgICAgIGlmIChpZCA9PT0gJ25ldycpIHJldHVyblxuICAgICAgaWYgKGlkID09PSB0aGlzLnZpZXcucm9vdCkgcmV0dXJuXG4gICAgICB0aGlzLnZpZXcuc3RhcnRNb3ZpbmcoaWQpXG4gICAgfSxcblxuICAgIC8vIG1vZGlmaWNhdGlvblxuICAgIHVuZG86IGZ1bmN0aW9uICgpIHt0aGlzLmNtZC51bmRvKCl9LFxuICAgIHJlZG86IGZ1bmN0aW9uICgpIHt0aGlzLmNtZC5yZWRvKCl9LFxuXG4gICAgLy8gY29tbWFuZGVyc1xuICAgIGN1dDogZnVuY3Rpb24gKGlkcykge1xuICAgICAgaWYgKGlkcyA9PT0gdGhpcy52aWV3LnJvb3QpIHJldHVyblxuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGlkcykpIHtcbiAgICAgICAgaWRzID0gW2lkc11cbiAgICAgIH1cbiAgICAgIHRoaXMuZXhlY3V0ZUNvbW1hbmRzKCdjdXQnLCBbaWRzXSlcbiAgICB9LFxuICAgIGNvcHk6IGZ1bmN0aW9uIChpZHMpIHtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShpZHMpKSB7XG4gICAgICAgIGlkcyA9IFtpZHNdXG4gICAgICB9XG4gICAgICB0aGlzLmV4ZWN1dGVDb21tYW5kcygnY29weScsIFtpZHNdKVxuICAgIH0sXG5cbiAgICBwYXN0ZTogZnVuY3Rpb24gKGlkLCBhYm92ZSkge1xuICAgICAgaWYgKCF0aGlzLm1vZGVsLmNsaXBib2FyZCkgcmV0dXJuXG4gICAgICB2YXIgbncgPSB0aGlzLm1vZGVsLmlkTmV3KGlkLCBhYm92ZSlcbiAgICAgIHRoaXMuZXhlY3V0ZUNvbW1hbmRzKCdwYXN0ZScsIFtudy5waWQsIG53LmluZGV4XSlcbiAgICB9LFxuICAgIGNoYW5nZWQ6IGZ1bmN0aW9uIChpZCwgYXR0ciwgdmFsdWUpIHtcbiAgICAgIGlmIChpZCA9PT0gJ25ldycpIHtcbiAgICAgICAgaWYgKCF2YWx1ZSkgcmV0dXJuXG4gICAgICAgIHZhciBudyA9IHRoaXMudmlldy5yZW1vdmVOZXcoKVxuICAgICAgICB0aGlzLmV4ZWN1dGVDb21tYW5kcygnbmV3Tm9kZScsIFtudy5waWQsIG53LmluZGV4LCB2YWx1ZV0pXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgdGhpcy5leGVjdXRlQ29tbWFuZHMoJ2NoYW5nZU5vZGVBdHRyJywgW2lkLCBhdHRyLCB2YWx1ZV0pXG4gICAgfSxcbiAgICBtb3ZlOiBmdW5jdGlvbiAod2hlcmUsIGlkLCB0YXJnZXQpIHtcbiAgICAgIHZhciBhY3Rpb24gPSB7XG4gICAgICAgIGJlZm9yZTogJ1RvQmVmb3JlJyxcbiAgICAgICAgYWZ0ZXI6ICdUb0FmdGVyJyxcbiAgICAgICAgY2hpbGQ6ICdJbnRvJ1xuICAgICAgfVt3aGVyZV1cbiAgICAgIHRoaXMuYWN0aW9uc1snbW92ZScgKyBhY3Rpb25dKGlkLCB0YXJnZXQpLy90YXJnZXQsIGlkKVxuICAgIH0sXG4gICAgbW92ZVRvQmVmb3JlOiBmdW5jdGlvbiAoaWQsIHNpZCkge1xuICAgICAgaWYgKGlkID09PSB0aGlzLnZpZXcucm9vdCkgcmV0dXJuXG4gICAgICBpZiAoaWQgPT09ICduZXcnKSByZXR1cm5cbiAgICAgIHZhciBwbGFjZSA9IHRoaXMubW9kZWwubW92ZUJlZm9yZVBsYWNlKHNpZCwgaWQpXG4gICAgICBpZiAoIXBsYWNlKSByZXR1cm5cbiAgICAgIC8vIGlmICh0aGlzLm1vZGVsLnNhbWVQbGFjZShpZCwgcGxhY2UpKSByZXR1cm5cbiAgICAgIHRoaXMuZXhlY3V0ZUNvbW1hbmRzKCdtb3ZlJywgW2lkLCBwbGFjZS5waWQsIHBsYWNlLml4XSlcbiAgICB9LFxuICAgIG1vdmVUb0FmdGVyOiBmdW5jdGlvbiAoaWQsIHNpZCkge1xuICAgICAgaWYgKGlkID09PSB0aGlzLnZpZXcucm9vdCkgcmV0dXJuXG4gICAgICBpZiAoaWQgPT09ICduZXcnKSByZXR1cm5cbiAgICAgIHZhciBwbGFjZSA9IHRoaXMubW9kZWwubW92ZUFmdGVyUGxhY2Uoc2lkLCBpZClcbiAgICAgIGlmICghcGxhY2UpIHJldHVyblxuICAgICAgLy8gaWYgKHRoaXMubW9kZWwuc2FtZVBsYWNlKGlkLCBwbGFjZSkpIHJldHVyblxuICAgICAgdGhpcy5leGVjdXRlQ29tbWFuZHMoJ21vdmUnLCBbaWQsIHBsYWNlLnBpZCwgcGxhY2UuaXhdKVxuICAgIH0sXG4gICAgbW92ZUludG86IGZ1bmN0aW9uIChpZCwgcGlkKSB7XG4gICAgICBpZiAoaWQgPT09IHRoaXMudmlldy5yb290KSByZXR1cm5cbiAgICAgIGlmIChpZCA9PT0gJ25ldycpIHJldHVyblxuICAgICAgaWYgKHRoaXMubW9kZWwuc2FtZVBsYWNlKGlkLCB7cGlkOiBwaWQsIGl4OiAwfSkpIHJldHVyblxuICAgICAgaWYgKCF0aGlzLm1vZGVsLmlzQ29sbGFwc2VkKHBpZCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXhlY3V0ZUNvbW1hbmRzKCdtb3ZlJywgW2lkLCBwaWQsIDBdKVxuICAgICAgfVxuICAgICAgdGhpcy5leGVjdXRlQ29tbWFuZHMoJ2NvbGxhcHNlJywgW3BpZCwgZmFsc2VdLCAnbW92ZScsIFtpZCwgcGlkLCAwXSlcbiAgICB9LFxuICAgIG1vdmVSaWdodDogZnVuY3Rpb24gKGlkKSB7XG4gICAgICBpZiAoaWQgPT09IHRoaXMudmlldy5yb290KSByZXR1cm5cbiAgICAgIGlmIChpZCA9PT0gJ25ldycpIHJldHVyblxuICAgICAgdmFyIHNpYiA9IHRoaXMubW9kZWwucHJldlNpYmxpbmcoaWQsIHRydWUpXG4gICAgICBpZiAodW5kZWZpbmVkID09PSBzaWIpIHJldHVyblxuICAgICAgaWYgKCF0aGlzLm1vZGVsLmlzQ29sbGFwc2VkKHNpYikpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXhlY3V0ZUNvbW1hbmRzKCdtb3ZlJywgW2lkLCBzaWIsIGZhbHNlXSlcbiAgICAgIH1cbiAgICAgIHRoaXMuZXhlY3V0ZUNvbW1hbmRzKCdjb2xsYXBzZScsIFtzaWIsIGZhbHNlXSwgJ21vdmUnLCBbaWQsIHNpYiwgZmFsc2VdKVxuICAgIH0sXG4gICAgbW92ZUxlZnQ6IGZ1bmN0aW9uIChpZCkge1xuICAgICAgaWYgKGlkID09PSB0aGlzLnZpZXcucm9vdCkgcmV0dXJuXG4gICAgICBpZiAoaWQgPT09ICduZXcnKSByZXR1cm5cbiAgICAgIGlmICh0aGlzLm1vZGVsLmlkc1tpZF0ucGFyZW50ID09PSB0aGlzLnZpZXcucm9vdCkgcmV0dXJuXG4gICAgICAvLyBUT0RPIGhhbmRsZSBtdWx0aXBsZSBzZWxlY3RlZFxuICAgICAgdmFyIHBsYWNlID0gdGhpcy5tb2RlbC5zaGlmdExlZnRQbGFjZShpZClcbiAgICAgIGlmICghcGxhY2UpIHJldHVyblxuICAgICAgdGhpcy5leGVjdXRlQ29tbWFuZHMoJ21vdmUnLCBbaWQsIHBsYWNlLnBpZCwgcGxhY2UuaXhdKVxuICAgIH0sXG4gICAgbW92ZVVwOiBmdW5jdGlvbiAoaWQpIHtcbiAgICAgIGlmIChpZCA9PT0gdGhpcy52aWV3LnJvb3QpIHJldHVyblxuICAgICAgaWYgKGlkID09PSAnbmV3JykgcmV0dXJuXG4gICAgICAvLyBUT0RPIGhhbmRsZSBtdWx0aXBsZSBzZWxlY3RlZFxuICAgICAgdmFyIHBsYWNlID0gdGhpcy5tb2RlbC5zaGlmdFVwUGxhY2UoaWQpXG4gICAgICBpZiAoIXBsYWNlKSByZXR1cm5cbiAgICAgIHRoaXMuZXhlY3V0ZUNvbW1hbmRzKCdtb3ZlJywgW2lkLCBwbGFjZS5waWQsIHBsYWNlLml4XSlcbiAgICB9LFxuICAgIG1vdmVEb3duOiBmdW5jdGlvbiAoaWQpIHtcbiAgICAgIGlmIChpZCA9PT0gdGhpcy52aWV3LnJvb3QpIHJldHVyblxuICAgICAgaWYgKGlkID09PSAnbmV3JykgcmV0dXJuXG4gICAgICAvLyBUT0RPIGhhbmRsZSBtdWx0aXBsZSBzZWxlY3RlZFxuICAgICAgdmFyIHBsYWNlID0gdGhpcy5tb2RlbC5zaGlmdERvd25QbGFjZShpZClcbiAgICAgIGlmICghcGxhY2UpIHJldHVyblxuICAgICAgdGhpcy5leGVjdXRlQ29tbWFuZHMoJ21vdmUnLCBbaWQsIHBsYWNlLnBpZCwgcGxhY2UuaXhdKVxuICAgIH0sXG4gICAgbW92ZVRvVG9wOiBmdW5jdGlvbiAoaWQpIHtcbiAgICAgIGlmIChpZCA9PT0gdGhpcy52aWV3LnJvb3QpIHJldHVyblxuICAgICAgaWYgKGlkID09PSAnbmV3JykgcmV0dXJuXG4gICAgICB2YXIgZmlyc3QgPSB0aGlzLm1vZGVsLmZpcnN0U2libGluZyhpZClcbiAgICAgIGlmICh1bmRlZmluZWQgPT09IGZpcnN0KSByZXR1cm5cbiAgICAgIHZhciBwaWQgPSB0aGlzLm1vZGVsLmlkc1tmaXJzdF0ucGFyZW50XG4gICAgICBpZiAocGlkID09PSB1bmRlZmluZWQpIHJldHVyblxuICAgICAgdmFyIGl4ID0gdGhpcy5tb2RlbC5pZHNbcGlkXS5jaGlsZHJlbi5pbmRleE9mKGZpcnN0KVxuICAgICAgdGhpcy5leGVjdXRlQ29tbWFuZHMoJ21vdmUnLCBbaWQsIHBpZCwgaXhdKVxuICAgIH0sXG4gICAgbW92ZVRvQm90dG9tOiBmdW5jdGlvbiAoaWQpIHtcbiAgICAgIGlmIChpZCA9PT0gdGhpcy52aWV3LnJvb3QpIHJldHVyblxuICAgICAgaWYgKGlkID09PSAnbmV3JykgcmV0dXJuXG4gICAgICB2YXIgbGFzdCA9IHRoaXMubW9kZWwubGFzdFNpYmxpbmcoaWQpXG4gICAgICBpZiAodW5kZWZpbmVkID09PSBsYXN0KSByZXR1cm5cbiAgICAgIHZhciBwaWQgPSB0aGlzLm1vZGVsLmlkc1tsYXN0XS5wYXJlbnRcbiAgICAgIGlmIChwaWQgPT09IHVuZGVmaW5lZCkgcmV0dXJuXG4gICAgICB2YXIgaXggPSB0aGlzLm1vZGVsLmlkc1twaWRdLmNoaWxkcmVuLmluZGV4T2YobGFzdClcbiAgICAgIHRoaXMuZXhlY3V0ZUNvbW1hbmRzKCdtb3ZlJywgW2lkLCBwaWQsIGl4ICsgMV0pXG4gICAgfSxcbiAgICB0b2dnbGVDb2xsYXBzZTogZnVuY3Rpb24gKGlkLCB5ZXMpIHtcbiAgICAgIGlmIChpZCA9PT0gdGhpcy52aWV3LnJvb3QpIHJldHVyblxuICAgICAgaWYgKGlkID09PSAnbmV3JykgcmV0dXJuXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICB5ZXMgPSAhdGhpcy5tb2RlbC5pZHNbaWRdLmNoaWxkcmVuLmxlbmd0aCB8fCAhdGhpcy5tb2RlbC5pc0NvbGxhcHNlZChpZClcbiAgICAgIH1cbiAgICAgIGlmICh5ZXMpIHtcbiAgICAgICAgaWQgPSB0aGlzLm1vZGVsLmZpbmRDb2xsYXBzZXIoaWQpXG4gICAgICAgIGlmICghdGhpcy5tb2RlbC5oYXNDaGlsZHJlbihpZCkgfHwgdGhpcy5tb2RlbC5pc0NvbGxhcHNlZChpZCkpIHJldHVyblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCF0aGlzLm1vZGVsLmhhc0NoaWxkcmVuKGlkKSB8fCAhdGhpcy5tb2RlbC5pc0NvbGxhcHNlZChpZCkpIHJldHVyblxuICAgICAgfVxuICAgICAgdGhpcy5leGVjdXRlQ29tbWFuZHMoJ2NvbGxhcHNlJywgW2lkLCB5ZXNdKVxuICAgIH0sXG4gICAgYWRkQmVmb3JlOiBmdW5jdGlvbiAoaWQsIHRleHQpIHtcbiAgICAgIGlmIChpZCA9PT0gdGhpcy52aWV3LnJvb3QpIHJldHVyblxuICAgICAgaWYgKGlkID09PSAnbmV3Jykge1xuICAgICAgICAvLyBUT0RPOiBiZXR0ZXIgYmVoYXZpb3IgaGVyZVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHZhciBudyA9IHRoaXMubW9kZWwuaWROZXcoaWQsIHRydWUpXG4gICAgICB0aGlzLmV4ZWN1dGVDb21tYW5kcygnbmV3Tm9kZScsIFtudy5waWQsIG53LmluZGV4LCB0ZXh0XSlcbiAgICB9LFxuICAgIGFkZEFmdGVyOiBmdW5jdGlvbiAoaWQsIHRleHQpIHtcbiAgICAgIHZhciBud1xuICAgICAgaWYgKGlkID09PSAnbmV3Jykge1xuICAgICAgICAvLyBUT0RPOiBiZXR0ZXIgYmVoYXZpb3IgaGVyZVxuXG4gICAgICAgIG53ID0gdGhpcy52aWV3LnJlbW92ZU5ldygpXG4gICAgICAgIHRoaXMuZXhlY3V0ZUNvbW1hbmRzKFxuICAgICAgICAgICduZXdOb2RlJywgW253LnBpZCwgbncuaW5kZXgrMSwgJyddXG4gICAgICAgIClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBpZiAoaWQgPT09IHRoaXMudmlldy5yb290KSB7XG4gICAgICAgIGlmICh0aGlzLnZpZXcubmV3Tm9kZSkgcmV0dXJuIHRoaXMudmlldy5zdGFydEVkaXRpbmcoJ25ldycpXG4gICAgICAgIHRoaXMudmlldy5hZGROZXcoaWQsIDApXG4gICAgICAgIHRoaXMudmlldy5zdGFydEVkaXRpbmcoJ25ldycpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgbncgPSB0aGlzLm1vZGVsLmlkTmV3KGlkLCBmYWxzZSwgdGhpcy52aWV3LnJvb3QpXG4gICAgICB2YXIgZWQgPSB0aGlzLnZpZXcuZWRpdGluZ1xuICAgICAgdGhpcy5leGVjdXRlQ29tbWFuZHMoJ25ld05vZGUnLCBbbncucGlkLCBudy5pbmRleCwgdGV4dF0pXG4gICAgICBpZiAoZWQpIHRoaXMudmlldy5zdGFydEVkaXRpbmcoKVxuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiAoaWQsIGFkZFRleHQpIHtcbiAgICAgIGlmIChpZCA9PT0gdGhpcy52aWV3LnJvb3QpIHJldHVyblxuICAgICAgaWYgKGlkID09PSAnbmV3JykgcmV0dXJuXG4gICAgICB2YXIgYmVmb3JlID0gdGhpcy5tb2RlbC5pZEFib3ZlKGlkKVxuICAgICAgdGhpcy5leGVjdXRlQ29tbWFuZHMoXG4gICAgICAgICdyZW1vdmUnLCBbaWRdLFxuICAgICAgICAnYXBwZW5kVGV4dCcsIFtiZWZvcmUsIGFkZFRleHQgfHwgJyddXG4gICAgICApXG4gICAgfSxcbiAgICBzZXRFZGl0aW5nOiAndmlldycsXG4gICAgZG9uZUVkaXRpbmc6ICd2aWV3J1xuICB9XG59XG5cbiIsIlxubW9kdWxlLmV4cG9ydHMgPSBEZWZhdWx0Tm9kZVxuXG52YXIgQmFzZU5vZGUgPSByZXF1aXJlKCcuL2Jhc2Utbm9kZScpXG5cbmlmICh3aW5kb3cubWFya2VkKSB7XG4gIG1hcmtlZC5zZXRPcHRpb25zKHtcbiAgICBnZm06IHRydWUsXG4gICAgdGFibGVzOiB0cnVlLFxuICAgIGJyZWFrczogdHJ1ZSxcbiAgICBwZWRhbnRpYzogZmFsc2UsXG4gICAgc2FuaXRpemU6IGZhbHNlLFxuICAgIHNtYXJ0TGlzdHM6IHRydWUsXG4gICAgc21hcnR5cGFudHM6IHRydWVcbiAgfSlcbn1cblxuZnVuY3Rpb24gRGVmYXVsdE5vZGUoZGF0YSwgb3B0aW9ucywgaXNOZXcpIHtcbiAgQmFzZU5vZGUuY2FsbCh0aGlzLCBkYXRhLCBvcHRpb25zLCBpc05ldylcbn1cblxuRGVmYXVsdE5vZGUucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShCYXNlTm9kZS5wcm90b3R5cGUpXG5EZWZhdWx0Tm9kZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBEZWZhdWx0Tm9kZVxuLy8gbWVyZ2UoRGVmYXVsdE5vZGUsIEJhc2VOb2RlKVxuXG5mdW5jdGlvbiB0bWVyZ2UoYSwgYikge1xuICBmb3IgKHZhciBjIGluIGIpIHtcbiAgICBhW2NdID0gYltjXVxuICB9XG59XG5cbnRtZXJnZShEZWZhdWx0Tm9kZS5wcm90b3R5cGUsIHtcbiAgc2V0SW5wdXRWYWx1ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdmFyIGh0bWwgPSB2YWx1ZS5yZXBsYWNlKC88L2csICcmbHQ7JykucmVwbGFjZSgvPi9nLCAnJmd0OycpXG4gICAgdGhpcy5pbnB1dC5pbm5lckhUTUwgPSBodG1sO1xuICB9LFxuICBnZXRJbnB1dFZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5wdXQuaW5uZXJIVE1MXG4gICAgICAgICAgICAucmVwbGFjZSgvPGRpdj4vZywgJ1xcbicpLnJlcGxhY2UoLzxicj4vZywgJ1xcbicpXG4gICAgICAgICAgICAucmVwbGFjZSgvPFxcL2Rpdj4vZywgJycpLnJlcGxhY2UoLyZsdDsvZywgJzwnKVxuICAgICAgICAgICAgLnJlcGxhY2UoLyZndDsvZywgJz4nKS5yZXBsYWNlKC9cXHUyMDBiL2csICcnKVxuICB9LFxuICBzZXRUZXh0Q29udGVudDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdGhpcy50ZXh0LmlubmVySFRNTCA9IG1hcmtlZCh2YWx1ZSlcbiAgfSxcbiAgc2V0dXBOb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5ub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICB0aGlzLmlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICB0aGlzLmlucHV0LnNldEF0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJywgdHJ1ZSlcbiAgICB0aGlzLmlucHV0LmNsYXNzTGlzdC5hZGQoJ3RyZWVkX19pbnB1dCcpXG4gICAgdGhpcy50ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICB0aGlzLnRleHQuY2xhc3NMaXN0LmFkZCgndHJlZWRfX3RleHQnKVxuICAgIHRoaXMubm9kZS5jbGFzc0xpc3QuYWRkKCd0cmVlZF9fZGVmYXVsdC1ub2RlJylcblxuICAgIHRoaXMuc2V0VGV4dENvbnRlbnQodGhpcy5uYW1lKVxuICAgIHRoaXMubm9kZS5hcHBlbmRDaGlsZCh0aGlzLnRleHQpXG4gICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVycygpO1xuICB9LFxuICBpc0F0VG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGJiID0gdGhpcy5pbnB1dC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgLCBzZWxyID0gd2luZG93LmdldFNlbGVjdGlvbigpLmdldFJhbmdlQXQoMCkuZ2V0Q2xpZW50UmVjdHMoKVswXVxuICAgIHJldHVybiBzZWxyLnRvcCA8IGJiLnRvcCArIDVcbiAgfSxcbiAgaXNBdEJvdHRvbTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBiYiA9IHRoaXMuaW5wdXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICwgc2VsciA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5nZXRSYW5nZUF0KDApLmdldENsaWVudFJlY3RzKClbMF1cbiAgICByZXR1cm4gc2Vsci5ib3R0b20gPiBiYi5ib3R0b20gLSA1XG4gIH0sXG4gIGdldFNlbGVjdGlvblBvc2l0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKVxuICAgICAgLCByYW4gPSBzZWwuZ2V0UmFuZ2VBdCgwKVxuICAgIHJldHVybiByYW4uc3RhcnRPZmZzZXRcbiAgfSxcbiAgc3RhcnRFZGl0aW5nOiBmdW5jdGlvbiAoZnJvbVN0YXJ0KSB7XG4gICAgaWYgKHRoaXMuZWRpdGluZykgcmV0dXJuXG4gICAgdGhpcy5lZGl0aW5nID0gdHJ1ZTtcbiAgICB0aGlzLnNldElucHV0VmFsdWUodGhpcy5uYW1lKVxuICAgIHRoaXMubm9kZS5yZXBsYWNlQ2hpbGQodGhpcy5pbnB1dCwgdGhpcy50ZXh0KVxuICAgIHRoaXMuaW5wdXQuZm9jdXMoKTtcbiAgICB0aGlzLnNldFNlbGVjdGlvbighZnJvbVN0YXJ0KVxuICAgIHRoaXMuby5zZXRFZGl0aW5nKClcbiAgfSxcbiAgc3RvcEVkaXRpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuZWRpdGluZykgcmV0dXJuXG4gICAgY29uc29sZS5sb2coJ3N0b3AgZWRkaW50JywgdGhpcy5pc05ldylcbiAgICB2YXIgdmFsdWUgPSB0aGlzLmdldElucHV0VmFsdWUoKVxuICAgIHRoaXMuZWRpdGluZyA9IGZhbHNlXG4gICAgdGhpcy5ub2RlLnJlcGxhY2VDaGlsZCh0aGlzLnRleHQsIHRoaXMuaW5wdXQpXG4gICAgdGhpcy5vLmRvbmVFZGl0aW5nKCk7XG4gICAgaWYgKHRoaXMubmFtZSAhPSB2YWx1ZSB8fCB0aGlzLmlzTmV3KSB7XG4gICAgICB0aGlzLnNldFRleHRDb250ZW50KHZhbHVlKVxuICAgICAgdGhpcy5uYW1lID0gdmFsdWVcbiAgICAgIHRoaXMuby5jaGFuZ2VkKCduYW1lJywgdGhpcy5uYW1lKVxuICAgIH1cbiAgfSxcblxuICBpc0F0U3RhcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRTZWxlY3Rpb25Qb3NpdGlvbigpID09PSAwXG4gIH0sXG5cbiAgaXNBdEVuZDogZnVuY3Rpb24gKCkge1xuICAgIGNvbnNvbGUud2FybihcIlRISVMgSVMgV1JPTkdcIilcbiAgICByZXR1cm4gZmFsc2VcbiAgfSxcbiAgYWRkRWRpdFRleHQ6IGZ1bmN0aW9uICh0ZXh0KSB7XG4gICAgdmFyIHBsID0gdGhpcy5uYW1lLmxlbmd0aFxuICAgIHRoaXMubmFtZSArPSB0ZXh0XG4gICAgdGhpcy5zZXRJbnB1dFZhbHVlKHRoaXMubmFtZSlcbiAgICB0aGlzLnNldFRleHRDb250ZW50KHRoaXMubmFtZSlcbiAgICBpZiAoIXRoaXMuZWRpdGluZykge1xuICAgICAgdGhpcy5lZGl0aW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMubm9kZS5yZXBsYWNlQ2hpbGQodGhpcy5pbnB1dCwgdGhpcy50ZXh0KVxuICAgICAgdGhpcy5vLnNldEVkaXRpbmcoKTtcbiAgICB9XG4gICAgdGhpcy5zZXRTZWxlY3Rpb24ocGwpXG4gIH0sXG4gIHNldEF0dHI6IGZ1bmN0aW9uIChhdHRyLCB2YWx1ZSkge1xuICAgIGlmIChhdHRyID09PSAnbmFtZScpIHtcbiAgICAgIHRoaXMubmFtZSA9IHZhbHVlXG4gICAgICB0aGlzLnNldElucHV0VmFsdWUodmFsdWUpXG4gICAgICB0aGlzLnNldFRleHRDb250ZW50KHZhbHVlKVxuICAgIH1cbiAgfSxcblxuICByZWdpc3Rlckxpc3RlbmVyczogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMudGV4dC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgdGhpcy5zdGFydEVkaXRpbmcoKTtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfS5iaW5kKHRoaXMpKVxuXG4gICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIHRoaXMuc3RvcEVkaXRpbmcoKTtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICBcbiAgICB2YXIga2V5SGFuZGxlciA9IHRoaXMua2V5SGFuZGxlcigpXG5cbiAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgcmV0dXJuIGtleUhhbmRsZXIoZSlcbiAgICB9KVxuXG4gIH0sXG4gIHNldFNlbGVjdGlvbjogZnVuY3Rpb24gKGVuZCkge1xuICAgIHZhciBzZWwgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKClcbiAgICBzZWwuc2VsZWN0QWxsQ2hpbGRyZW4odGhpcy5pbnB1dClcbiAgICB0cnkge1xuICAgICAgc2VsWydjb2xsYXBzZVRvJyArIChlbmQgPyAnRW5kJyA6ICdTdGFydCcpXSgpXG4gICAgfSBjYXRjaCAoZSkge31cbiAgfSxcblxufSlcblxuIiwiXG5tb2R1bGUuZXhwb3J0cyA9IER1bmdlb25zQW5kRHJhZ29uc1xuXG5mdW5jdGlvbiBmaW5kVGFyZ2V0KHRhcmdldHMsIGUpIHtcbiAgZm9yICh2YXIgaT0wOyBpPHRhcmdldHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAodGFyZ2V0c1tpXS50b3AgPiBlLmNsaWVudFkpIHtcbiAgICAgIHJldHVybiB0YXJnZXRzW2kgPiAwID8gaS0xIDogMF1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRhcmdldHNbdGFyZ2V0cy5sZW5ndGgtMV1cbn1cblxuLy8gTWFuYWdlcyBEcmFnZ2luZyBOIERyb3BwaW5nXG5mdW5jdGlvbiBEdW5nZW9uc0FuZERyYWdvbnModmwsIGFjdGlvbikge1xuICB0aGlzLnZsID0gdmxcbiAgdGhpcy5hY3Rpb24gPSBhY3Rpb25cbn1cblxuRHVuZ2VvbnNBbmREcmFnb25zLnByb3RvdHlwZSA9IHtcbiAgc3RhcnRNb3Zpbmc6IGZ1bmN0aW9uICh0YXJnZXRzLCBpZCkge1xuICAgIHRoaXMubW92aW5nID0ge1xuICAgICAgdGFyZ2V0czogdGFyZ2V0cyxcbiAgICAgIHNoYWRvdzogdGhpcy52bC5tYWtlRHJvcFNoYWRvdygpLFxuICAgICAgY3VycmVudDogbnVsbFxuICAgIH1cbiAgICB0aGlzLnZsLnNldE1vdmluZyhpZCwgdHJ1ZSlcbiAgICB2YXIgb25Nb3ZlID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgIHRoaXMuZHJhZyhpZCwgZSlcbiAgICB9LmJpbmQodGhpcylcbiAgICB2YXIgb25VcCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmN1cnNvciA9ICcnXG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdmUpXG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25VcClcbiAgICAgIHRoaXMuZHJvcChpZCwgZSlcbiAgICB9LmJpbmQodGhpcylcblxuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuY3Vyc29yID0gJ21vdmUnXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3ZlKVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvblVwKVxuICB9LFxuICBkcmFnOiBmdW5jdGlvbiAoaWQsIGUpIHtcbiAgICBpZiAodGhpcy5tb3ZpbmcuY3VycmVudCkge1xuICAgICAgdGhpcy52bC5zZXREcm9wcGluZyh0aGlzLm1vdmluZy5jdXJyZW50LmlkLCBmYWxzZSwgdGhpcy5tb3ZpbmcuY3VycmVudC5wbGFjZSA9PT0gJ2NoaWxkJylcbiAgICB9XG4gICAgdmFyIHRhcmdldCA9IGZpbmRUYXJnZXQodGhpcy5tb3ZpbmcudGFyZ2V0cywgZSlcbiAgICB0aGlzLm1vdmluZy5zaGFkb3cubW92ZVRvKHRhcmdldClcbiAgICB0aGlzLm1vdmluZy5jdXJyZW50ID0gdGFyZ2V0XG4gICAgdGhpcy52bC5zZXREcm9wcGluZyh0YXJnZXQuaWQsIHRydWUsIHRoaXMubW92aW5nLmN1cnJlbnQucGxhY2UgPT09ICdjaGlsZCcpXG4gIH0sXG4gIGRyb3A6IGZ1bmN0aW9uIChpZCwgZSkge1xuICAgIHRoaXMubW92aW5nLnNoYWRvdy5yZW1vdmUoKVxuICAgIHZhciBjdXJyZW50ID0gdGhpcy5tb3ZpbmcuY3VycmVudFxuICAgIHRoaXMudmwuc2V0TW92aW5nKGlkLCBmYWxzZSlcbiAgICBpZiAoIXRoaXMubW92aW5nLmN1cnJlbnQpIHJldHVyblxuICAgIHRoaXMudmwuc2V0RHJvcHBpbmcoY3VycmVudC5pZCwgZmFsc2UsIGN1cnJlbnQucGxhY2UgPT09ICdjaGlsZCcpXG4gICAgaWYgKGN1cnJlbnQuaWQgPT09IGlkKSByZXR1cm5cbiAgICB0aGlzLmFjdGlvbihjdXJyZW50LnBsYWNlLCBpZCwgY3VycmVudC5pZClcbiAgICB0aGlzLm1vdmluZyA9IGZhbHNlXG4gIH0sXG59XG5cbiIsIlxubW9kdWxlLmV4cG9ydHMgPSBEb21WaWV3TGF5ZXJcblxuZnVuY3Rpb24gZW5zdXJlSW5WaWV3KGl0ZW0pIHtcbiAgdmFyIGJiID0gaXRlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICBpZiAoYmIudG9wIDwgMCkgcmV0dXJuIGl0ZW0uc2Nyb2xsSW50b1ZpZXcoKVxuICBpZiAoYmIuYm90dG9tID4gd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgaXRlbS5zY3JvbGxJbnRvVmlldyhmYWxzZSlcbiAgfVxufVxuXG5mdW5jdGlvbiBEcm9wU2hhZG93KGhlaWdodCwgY2xzTmFtZSkge1xuICB0aGlzLm5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICB0aGlzLm5vZGUuY2xhc3NMaXN0LmFkZChjbHNOYW1lIHx8ICd0cmVlZF9fZHJvcC1zaGFkb3cnKVxuICB0aGlzLmhlaWdodCA9IGhlaWdodCB8fCAxMFxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMubm9kZSlcbn1cblxuRHJvcFNoYWRvdy5wcm90b3R5cGUgPSB7XG4gIG1vdmVUbzogZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIHRoaXMubm9kZS5zdHlsZS50b3AgPSB0YXJnZXQuc2hvdy55IC0gdGhpcy5oZWlnaHQvMiArICdweCdcbiAgICB0aGlzLm5vZGUuc3R5bGUubGVmdCA9IHRhcmdldC5zaG93LmxlZnQgKyAncHgnXG4gICAgdGhpcy5ub2RlLnN0eWxlLmhlaWdodCA9IHRoaXMuaGVpZ2h0ICsgJ3B4J1xuICAgIC8vIHRoaXMubm9kZS5zdHlsZS5oZWlnaHQgPSB0YXJnZXQuaGVpZ2h0ICsgMTAgKyAncHgnXG4gICAgdGhpcy5ub2RlLnN0eWxlLndpZHRoID0gdGFyZ2V0LnNob3cud2lkdGggKyAncHgnXG4gIH0sXG4gIHJlbW92ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMubm9kZSlcbiAgfVxufVxuXG5mdW5jdGlvbiBEb21WaWV3TGF5ZXIobykge1xuICB0aGlzLmRvbSA9IHt9XG4gIHRoaXMucm9vdCA9IG51bGxcbiAgdGhpcy5vID0gb1xufVxuXG5Eb21WaWV3TGF5ZXIucHJvdG90eXBlID0ge1xuICBjbGVhcjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZG9tID0ge31cbiAgfSxcbiAgcmViYXNlOiBmdW5jdGlvbiAocm9vdCkge1xuICAgIHJvb3QucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQodGhpcy5yb290LCByb290KVxuICB9LFxuICBkcm9wVGFyZ2V0czogZnVuY3Rpb24gKHJvb3QsIG1vZGVsLCBtb3ZpbmcsIHRvcCkge1xuICAgIHZhciB0YXJnZXRzID0gW11cbiAgICAgICwgYmMgPSB0aGlzLmRvbVtyb290XS5oZWFkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAsIHRhcmdldFxuICAgICAgLCBjaGlsZFRhcmdldFxuXG4gICAgaWYgKCF0b3ApIHtcbiAgICAgIHRhcmdldCA9IHtcbiAgICAgICAgaWQ6IHJvb3QsXG4gICAgICAgIHRvcDogYmMudG9wLFxuICAgICAgICBsZWZ0OiBiYy5sZWZ0LFxuICAgICAgICB3aWR0aDogYmMud2lkdGgsXG4gICAgICAgIGhlaWdodDogYmMuaGVpZ2h0LFxuICAgICAgICBwbGFjZTogJ2FmdGVyJywgLy8gJ2JlZm9yZScsXG4gICAgICAgIHNob3c6IHtcbiAgICAgICAgICBsZWZ0OiBiYy5sZWZ0LC8vICsgMjAsXG4gICAgICAgICAgd2lkdGg6IGJjLndpZHRoLC8vIC0gMjAsXG4gICAgICAgICAgeTogYmMuYm90dG9tXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtb2RlbC5pZHNbcm9vdF0uY2hpbGRyZW4ubGVuZ3RoICYmICFtb2RlbC5pc0NvbGxhcHNlZChyb290KSkge1xuICAgICAgICAvLyBzaG93IGluc2VydCBiZWxvdyBjaGlsZHJlblxuICAgICAgICB0YXJnZXQuc2hvdy55ID0gdGhpcy5kb21bcm9vdF0udWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuYm90dG9tXG4gICAgICB9XG4gICAgICB0YXJnZXRzLnB1c2godGFyZ2V0KVxuICAgIH1cbiAgICBpZiAocm9vdCA9PT0gbW92aW5nKSByZXR1cm4gdGFyZ2V0c1xuICAgIGNoaWxkVGFyZ2V0ID0ge1xuICAgICAgaWQ6IHJvb3QsXG4gICAgICB0b3A6IGJjLmJvdHRvbSAtIDcsXG4gICAgICBsZWZ0OiBiYy5sZWZ0ICsgMjAsXG4gICAgICB3aWR0aDogYmMud2lkdGgsXG4gICAgICBwbGFjZTogJ2NoaWxkJyxcbiAgICAgIHNob3c6IHtcbiAgICAgICAgbGVmdDogYmMubGVmdCArIDQwLFxuICAgICAgICB3aWR0aDogYmMud2lkdGggLSA0MCxcbiAgICAgICAgeTogYmMudG9wICsgYmMuaGVpZ2h0XG4gICAgICB9LFxuICAgICAgaGVpZ2h0OiA3XG4gICAgfVxuICAgIHRhcmdldHMucHVzaChjaGlsZFRhcmdldClcblxuICAgIGlmIChtb2RlbC5pc0NvbGxhcHNlZChyb290KSAmJiAhdG9wKSByZXR1cm4gdGFyZ2V0c1xuICAgIHZhciBjaCA9IG1vZGVsLmlkc1tyb290XS5jaGlsZHJlblxuICAgIGZvciAodmFyIGk9MDsgaTxjaC5sZW5ndGg7IGkrKykge1xuICAgICAgdGFyZ2V0cyA9IHRhcmdldHMuY29uY2F0KHRoaXMuZHJvcFRhcmdldHMoY2hbaV0sIG1vZGVsLCBtb3ZpbmcpKVxuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0c1xuICB9LFxuICBtYWtlRHJvcFNoYWRvdzogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgRHJvcFNoYWRvdygpXG4gIH0sXG5cbiAgcmVtb3ZlOiBmdW5jdGlvbiAoaWQsIHBpZCwgbGFzdGNoaWxkKSB7XG4gICAgdmFyIG4gPSB0aGlzLmRvbVtpZF1cbiAgICBpZiAoIW4ubWFpbi5wYXJlbnROb2RlKSByZXR1cm5cbiAgICB0cnkge1xuICAgICAgbi5tYWluLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobi5tYWluKVxuICAgIH0gY2F0Y2ggKGUpIHtyZXR1cm59XG4gICAgZGVsZXRlIHRoaXMuZG9tW2lkXVxuICAgIGlmIChsYXN0Y2hpbGQpIHtcbiAgICAgIHRoaXMuZG9tW3BpZF0ubWFpbi5jbGFzc0xpc3QuYWRkKCd0cmVlZF9faXRlbS0tcGFyZW50JylcbiAgICB9XG4gIH0sXG4gIGFkZE5ldzogZnVuY3Rpb24gKG5vZGUsIGJvdW5kcywgYmVmb3JlLCBjaGlsZHJlbikge1xuICAgIHZhciBkb20gPSB0aGlzLm1ha2VOb2RlKG5vZGUuaWQsIG5vZGUuZGF0YSwgbm9kZS5kZXB0aCAtIHRoaXMucm9vdERlcHRoLCBib3VuZHMpXG4gICAgdGhpcy5hZGQobm9kZS5wYXJlbnQsIGJlZm9yZSwgZG9tLCBjaGlsZHJlbilcbiAgICBpZiAobm9kZS5jb2xsYXBzZWQgJiYgbm9kZS5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgIHRoaXMuc2V0Q29sbGFwc2VkKG5vZGUuaWQsIHRydWUpXG4gICAgfVxuICB9LFxuICBhZGQ6IGZ1bmN0aW9uIChwYXJlbnQsIGJlZm9yZSwgZG9tLCBjaGlsZHJlbikge1xuICAgIHZhciBwID0gdGhpcy5kb21bcGFyZW50XVxuICAgIGlmIChiZWZvcmUgPT09IGZhbHNlKSB7XG4gICAgICBwLnVsLmFwcGVuZENoaWxkKGRvbSlcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGJlZiA9IHRoaXMuZG9tW2JlZm9yZV1cbiAgICAgIHAudWwuaW5zZXJ0QmVmb3JlKGRvbSwgYmVmLm1haW4pXG4gICAgfVxuICAgIGlmIChjaGlsZHJlbikge1xuICAgICAgZG9tLmNsYXNzTGlzdC5hZGQoJ3RyZWVkX19pdGVtLS1wYXJlbnQnKVxuICAgIH1cbiAgfSxcbiAgYm9keTogZnVuY3Rpb24gKGlkKSB7XG4gICAgaWYgKCF0aGlzLmRvbVtpZF0pIHJldHVyblxuICAgIHJldHVybiB0aGlzLmRvbVtpZF0uYm9keVxuICB9LFxuICBtb3ZlOiBmdW5jdGlvbiAoaWQsIHBpZCwgYmVmb3JlLCBwcGlkLCBsYXN0Y2hpbGQpIHtcbiAgICB2YXIgZCA9IHRoaXMuZG9tW2lkXVxuICAgIGQubWFpbi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGQubWFpbilcbiAgICBpZiAobGFzdGNoaWxkKSB7XG4gICAgICB0aGlzLmRvbVtwcGlkXS5tYWluLmNsYXNzTGlzdC5yZW1vdmUoJ3RyZWVkX19pdGVtLS1wYXJlbnQnKVxuICAgIH1cbiAgICBpZiAoYmVmb3JlID09PSBmYWxzZSkge1xuICAgICAgdGhpcy5kb21bcGlkXS51bC5hcHBlbmRDaGlsZChkLm1haW4pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZG9tW3BpZF0udWwuaW5zZXJ0QmVmb3JlKGQubWFpbiwgdGhpcy5kb21bYmVmb3JlXS5tYWluKVxuICAgIH1cbiAgICB0aGlzLmRvbVtwaWRdLm1haW4uY2xhc3NMaXN0LmFkZCgndHJlZWRfX2l0ZW0tLXBhcmVudCcpXG4gIH0sXG4gIGNsZWFyU2VsZWN0aW9uOiBmdW5jdGlvbiAoc2VsZWN0aW9uKSB7XG4gICAgZm9yICh2YXIgaT0wOyBpPHNlbGVjdGlvbi5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKCF0aGlzLmRvbVtzZWxlY3Rpb25baV1dKSBjb250aW51ZTtcbiAgICAgIHRoaXMuZG9tW3NlbGVjdGlvbltpXV0ubWFpbi5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpXG4gICAgfVxuICB9LFxuICBzaG93U2VsZWN0aW9uOiBmdW5jdGlvbiAoc2VsZWN0aW9uKSB7XG4gICAgaWYgKCFzZWxlY3Rpb24ubGVuZ3RoKSByZXR1cm5cbiAgICAvLyBlbnN1cmVJblZpZXcodGhpcy5kb21bc2VsZWN0aW9uWzBdXS5ib2R5Lm5vZGUpXG4gICAgZm9yICh2YXIgaT0wOyBpPHNlbGVjdGlvbi5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5kb21bc2VsZWN0aW9uW2ldXS5tYWluLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcbiAgICB9XG4gIH0sXG5cbiAgY2xlYXJBY3RpdmU6IGZ1bmN0aW9uIChpZCkge1xuICAgIGlmICghdGhpcy5kb21baWRdKSByZXR1cm5cbiAgICB0aGlzLmRvbVtpZF0ubWFpbi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICB9LFxuICBzaG93QWN0aXZlOiBmdW5jdGlvbiAoaWQpIHtcbiAgICBpZiAoIXRoaXMuZG9tW2lkXSkgcmV0dXJuIGNvbnNvbGUud2FybignVHJ5aW5nIHRvIGFjdGl2YXRlIGEgbm9kZSB0aGF0IGlzIG5vdCByZW5kZXJlZCcpXG4gICAgZW5zdXJlSW5WaWV3KHRoaXMuZG9tW2lkXS5ib2R5Lm5vZGUpXG4gICAgdGhpcy5kb21baWRdLm1haW4uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgfSxcblxuICBzZXRDb2xsYXBzZWQ6IGZ1bmN0aW9uIChpZCwgaXNDb2xsYXBzZWQpIHtcbiAgICB0aGlzLmRvbVtpZF0ubWFpbi5jbGFzc0xpc3RbaXNDb2xsYXBzZWQgPyAnYWRkJyA6ICdyZW1vdmUnXSgnY29sbGFwc2VkJylcbiAgfSxcblxuICBzZXRNb3Zpbmc6IGZ1bmN0aW9uIChpZCwgaXNNb3ZpbmcpIHtcbiAgICB0aGlzLnJvb3QuY2xhc3NMaXN0W2lzTW92aW5nID8gJ2FkZCcgOiAncmVtb3ZlJ10oJ21vdmluZycpXG4gICAgdGhpcy5kb21baWRdLm1haW4uY2xhc3NMaXN0W2lzTW92aW5nID8gJ2FkZCcgOiAncmVtb3ZlJ10oJ21vdmluZycpXG4gIH0sXG5cbiAgc2V0RHJvcHBpbmc6IGZ1bmN0aW9uIChpZCwgaXNEcm9wcGluZywgaXNDaGlsZCkge1xuICAgIHZhciBjbHMgPSAnZHJvcHBpbmcnICsgKGlzQ2hpbGQgPyAnLWNoaWxkJyA6ICcnKVxuICAgIHRoaXMuZG9tW2lkXS5tYWluLmNsYXNzTGlzdFtpc0Ryb3BwaW5nID8gJ2FkZCcgOiAncmVtb3ZlJ10oY2xzKVxuICB9LFxuXG4gIG1ha2VSb290OiBmdW5jdGlvbiAobm9kZSwgYm91bmRzKSB7XG4gICAgdmFyIGRvbSA9IHRoaXMubWFrZU5vZGUobm9kZS5pZCwgbm9kZS5kYXRhLCAwLCBib3VuZHMpXG4gICAgICAsIHJvb3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHJvb3QuY2xhc3NMaXN0LmFkZCgndHJlZWQnKVxuICAgIHJvb3QuYXBwZW5kQ2hpbGQoZG9tKVxuICAgIGlmIChub2RlLmNvbGxhcHNlZCAmJiBub2RlLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgdGhpcy5zZXRDb2xsYXBzZWQobm9kZS5pZCwgdHJ1ZSlcbiAgICB9XG4gICAgdGhpcy5yb290ID0gcm9vdFxuICAgIHRoaXMucm9vdERlcHRoID0gbm9kZS5kZXB0aFxuICAgIHJldHVybiByb290XG4gIH0sXG5cbiAgbWFrZUhlYWQ6IGZ1bmN0aW9uIChib2R5LCBhY3Rpb25zKSB7XG4gICAgdmFyIGhlYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgLCBjb2xsYXBzZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgLCBtb3ZlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cbiAgICBjb2xsYXBzZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGlmIChlLmJ1dHRvbiAhPT0gMCkgcmV0dXJuXG4gICAgICBhY3Rpb25zLnRvZ2dsZUNvbGxhcHNlKClcbiAgICB9KVxuICAgIGNvbGxhcHNlci5jbGFzc0xpc3QuYWRkKCd0cmVlZF9fY29sbGFwc2VyJylcblxuICAgIG1vdmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBpZiAoZS5idXR0b24gIT09IDApIHJldHVyblxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICBhY3Rpb25zLnN0YXJ0TW92aW5nKClcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0pXG4gICAgbW92ZXIuY2xhc3NMaXN0LmFkZCgndHJlZWRfX21vdmVyJylcblxuICAgIGhlYWQuY2xhc3NMaXN0LmFkZCgndHJlZWRfX2hlYWQnKVxuICAgIGhlYWQuYXBwZW5kQ2hpbGQoY29sbGFwc2VyKVxuICAgIGhlYWQuYXBwZW5kQ2hpbGQoYm9keS5ub2RlKTtcbiAgICBoZWFkLmFwcGVuZENoaWxkKG1vdmVyKVxuICAgIHJldHVybiBoZWFkXG4gIH0sXG5cbiAgbWFrZU5vZGU6IGZ1bmN0aW9uIChpZCwgZGF0YSwgbGV2ZWwsIGJvdW5kcykge1xuICAgIHZhciBkb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpXG4gICAgICAsIGJvZHkgPSB0aGlzLmJvZHlGb3IoaWQsIGRhdGEsIGJvdW5kcylcblxuICAgIGRvbS5jbGFzc0xpc3QuYWRkKCd0cmVlZF9faXRlbScpXG4gICAgLy8gZG9tLmNsYXNzTGlzdC5hZGQoJ3RyZWVkX19pdGVtLS1sZXZlbC0nICsgbGV2ZWwpXG5cbiAgICB2YXIgaGVhZCA9IHRoaXMubWFrZUhlYWQoYm9keSwgYm91bmRzKVxuICAgIGRvbS5hcHBlbmRDaGlsZChoZWFkKVxuXG4gICAgdmFyIHVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKVxuICAgIHVsLmNsYXNzTGlzdC5hZGQoJ3RyZWVkX19jaGlsZHJlbicpXG4gICAgZG9tLmFwcGVuZENoaWxkKHVsKVxuICAgIHRoaXMuZG9tW2lkXSA9IHttYWluOiBkb20sIGJvZHk6IGJvZHksIHVsOiB1bCwgaGVhZDogaGVhZH1cbiAgICByZXR1cm4gZG9tXG4gIH0sXG5cbiAgLyoqIHJldHVybnMgYSBkb20gbm9kZSAqKi9cbiAgYm9keUZvcjogZnVuY3Rpb24gKGlkLCBkYXRhLCBib3VuZHMpIHtcbiAgICB2YXIgZG9tID0gbmV3IHRoaXMuby5ub2RlKGRhdGEsIGJvdW5kcywgaWQgPT09ICduZXcnKVxuICAgIGRvbS5ub2RlLmNsYXNzTGlzdC5hZGQoJ3RyZWVkX19ib2R5JylcbiAgICByZXR1cm4gZG9tXG4gIH0sXG5cbn1cblxuIiwiXG5tb2R1bGUuZXhwb3J0cyA9IGtleXNcblxudmFyIEtFWVMgPSB7XG4gIDg6ICdiYWNrc3BhY2UnLFxuICA5OiAndGFiJyxcbiAgMTM6ICdyZXR1cm4nLFxuICAyNzogJ2VzY2FwZScsXG4gIDM3OiAnbGVmdCcsXG4gIDM4OiAndXAnLFxuICAzOTogJ3JpZ2h0JyxcbiAgNDA6ICdkb3duJyxcbiAgNDY6ICdkZWxldGUnLFxuICAxMTM6ICdmMicsXG4gIDIxOTogJ1snLFxuICAyMjE6ICddJ1xufVxuXG5mdW5jdGlvbiBrZXlOYW1lKGNvZGUpIHtcbiAgaWYgKGNvZGUgPD0gOTAgJiYgY29kZSA+PSA2NSkge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvZGUgKyAzMilcbiAgfVxuICByZXR1cm4gS0VZU1tjb2RlXVxufVxuXG5mdW5jdGlvbiBrZXlzKGNvbmZpZykge1xuICB2YXIga21hcCA9IHt9XG4gICAgLCBwcmVmaXhlcyA9IHt9XG4gICAgLCBjdXJfcHJlZml4ID0gbnVsbFxuICAgICwgcGFydHNcbiAgICAsIHBhcnRcbiAgICAsIHNlcVxuICBmb3IgKHZhciBuYW1lIGluIGNvbmZpZykge1xuICAgIHBhcnRzID0gbmFtZS5zcGxpdCgnLCcpXG4gICAgZm9yICh2YXIgaT0wO2k8cGFydHMubGVuZ3RoO2krKykge1xuICAgICAgcGFydCA9IHBhcnRzW2ldLnRyaW0oKVxuICAgICAga21hcFtwYXJ0XSA9IGNvbmZpZ1tuYW1lXVxuICAgICAgaWYgKHBhcnQuaW5kZXhPZignICcpICE9PSAtMSkge1xuICAgICAgICBzZXEgPSBwYXJ0LnNwbGl0KC9cXHMrL2cpXG4gICAgICAgIHZhciBuID0gJydcbiAgICAgICAgZm9yICh2YXIgaj0wOyBqPHNlcS5sZW5ndGgtMTsgaisrKSB7XG4gICAgICAgICAgbiArPSBzZXFbal1cbiAgICAgICAgICBwcmVmaXhlc1tuXSA9IHRydWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgbmFtZSA9IGtleU5hbWUoZS5rZXlDb2RlKVxuICAgIGlmICghbmFtZSkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKGUua2V5Q29kZSlcbiAgICB9XG4gICAgaWYgKGUuYWx0S2V5KSBuYW1lID0gJ2FsdCsnICsgbmFtZVxuICAgIGlmIChlLnNoaWZ0S2V5KSBuYW1lID0gJ3NoaWZ0KycgKyBuYW1lXG4gICAgaWYgKGUuY3RybEtleSkgbmFtZSA9ICdjdHJsKycgKyBuYW1lXG4gICAgaWYgKGN1cl9wcmVmaXgpIHtcbiAgICAgIG5hbWUgPSBjdXJfcHJlZml4ICsgJyAnICsgbmFtZVxuICAgICAgY3VyX3ByZWZpeCA9IG51bGxcbiAgICB9XG4gICAgaWYgKCFrbWFwW25hbWVdKSB7XG4gICAgICBpZiAocHJlZml4ZXNbbmFtZV0pIHtcbiAgICAgICAgY3VyX3ByZWZpeCA9IG5hbWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1cl9wcmVmaXggPSBudWxsXG4gICAgICB9XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKGttYXBbbmFtZV0uY2FsbCh0aGlzLCBlKSAhPT0gdHJ1ZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH1cbn1cblxuXG4iLCJcbm1vZHVsZS5leHBvcnRzID0gTW9kZWxcblxuXG5mdW5jdGlvbiBNb2RlbChyb290LCBpZHMsIGRiKSB7XG4gIHRoaXMuaWRzID0gaWRzXG4gIHRoaXMucm9vdCA9IHJvb3RcbiAgdGhpcy5kYiA9IGRiXG4gIHRoaXMubmV4dGlkID0gMTAwXG4gIHRoaXMuY2xpcGJvYXJkID0gZmFsc2Vcbn1cblxuLyoqXG4gKiBBIHNpbmdsZSBub2RlIGlzXG4gKiAtIGlkOlxuICogLSBwYXJlbnQ6IGlkXG4gKiAtIGNoaWxkcmVuOiBbaWQsIGlkLCBpZF1cbiAqIC0gZGF0YToge31cbiAqL1xuXG5Nb2RlbC5wcm90b3R5cGUgPSB7XG4gIG5ld2lkOiBmdW5jdGlvbiAoKSB7XG4gICAgd2hpbGUgKHRoaXMuaWRzW3RoaXMubmV4dGlkXSkge1xuICAgICAgdGhpcy5uZXh0aWQgKz0gMVxuICAgIH1cbiAgICB2YXIgaWQgPSB0aGlzLm5leHRpZFxuICAgIHRoaXMubmV4dGlkICs9IDFcbiAgICByZXR1cm4gaWRcbiAgfSxcblxuICAvLyBleHBvcnQgYWxsIHRoZSBkYXRhIGN1cnJlbnRseSBzdG9yZWQgaW4gdGhlIG1vZGVsXG4gIC8vIGR1bXBEYXRhKCkgLT4gYWxsIG9mIGl0XG4gIC8vIGR1bXBEYXRhKGlkKSAtPiBjaGlsZHJlbiBvZiB0aGUgZ2l2ZW4gaWRcbiAgLy8gZHVtcERhdGEoaWQsIHRydWUpIC0+IGluY2x1ZGUgdGhlIGlkcyBpbiB0aGUgZHVtcFxuICAvLyB7XG4gIC8vICAgIGlkOiA/PyxcbiAgLy8gICAgZGF0YToge30sXG4gIC8vICAgIGNvbGxhcHNlZDogPz8sXG4gIC8vICAgIGNoaWxkcmVuOiBbcmVjdXJzZSwgLi4uXVxuICAvLyB9XG4gIGR1bXBEYXRhOiBmdW5jdGlvbiAoaWQsIG5vaWRzKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGlkID0gdGhpcy5yb290XG4gICAgfVxuICAgIHZhciByZXMgPSB7ZGF0YToge319XG4gICAgICAsIG4gPSB0aGlzLmlkc1tpZF1cbiAgICBmb3IgKHZhciBuYW1lIGluIG4uZGF0YSkge1xuICAgICAgcmVzLmRhdGFbbmFtZV0gPSBuLmRhdGFbbmFtZV1cbiAgICB9XG4gICAgaWYgKG4uY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICByZXMuY2hpbGRyZW4gPSBbXVxuICAgICAgZm9yICh2YXIgaT0wOyBpPG4uY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmVzLmNoaWxkcmVuLnB1c2godGhpcy5kdW1wRGF0YShuLmNoaWxkcmVuW2ldLCBub2lkcykpXG4gICAgICB9XG4gICAgfVxuICAgIGlmICghbm9pZHMpIHJlcy5pZCA9IGlkXG4gICAgcmVzLmNvbGxhcHNlZCA9IG4uY29sbGFwc2VkXG4gICAgcmV0dXJuIHJlc1xuICB9LFxuXG4gIC8vIGNyZWF0ZU5vZGVzKHBhcmVudElkLCB0aGUgaW5kZXgsIGRhdGEgYXMgaXQgd2FzIGR1bXBlZClcbiAgLy8ge1xuICAvLyAgICBuYW1lOiBcIlwiLFxuICAvLyAgICAuLi4gb3RoZXIgZGF0YXNcbiAgLy8gICAgY2hpbGRyZW46IFtub2RlLCAuLi5dXG4gIC8vIH1cbiAgY3JlYXRlTm9kZXM6IGZ1bmN0aW9uIChwaWQsIGluZGV4LCBkYXRhKSB7XG4gICAgdmFyIGNyID0gdGhpcy5jcmVhdGUocGlkLCBpbmRleCwgZGF0YS5kYXRhKVxuICAgIGNyLm5vZGUuY29sbGFwc2VkID0gZGF0YS5jb2xsYXBzZWRcbiAgICBpZiAoZGF0YS5jaGlsZHJlbikge1xuICAgICAgZm9yICh2YXIgaT0wOyBpPGRhdGEuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5jcmVhdGVOb2Rlcyhjci5ub2RlLmlkLCBpLCBkYXRhLmNoaWxkcmVuW2ldKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY3JcbiAgfSxcblxuICBnZXRCZWZvcmU6IGZ1bmN0aW9uIChwaWQsIGluZGV4KSB7XG4gICAgdmFyIGJlZm9yZSA9IGZhbHNlXG4gICAgaWYgKGluZGV4IDwgdGhpcy5pZHNbcGlkXS5jaGlsZHJlbi5sZW5ndGggLSAxKSB7XG4gICAgICBiZWZvcmUgPSB0aGlzLmlkc1twaWRdLmNoaWxkcmVuW2luZGV4ICsgMV1cbiAgICB9XG4gICAgcmV0dXJuIGJlZm9yZVxuICB9LFxuXG4gIC8vIG9wZXJhdGlvbnNcbiAgY3JlYXRlOiBmdW5jdGlvbiAocGlkLCBpbmRleCwgdGV4dCkge1xuICAgIHZhciBub2RlID0ge1xuICAgICAgaWQ6IHRoaXMubmV3aWQoKSxcbiAgICAgIGRhdGE6IHtuYW1lOiB0ZXh0IHx8ICcnLCBkb25lOiBmYWxzZX0sXG4gICAgICBwYXJlbnQ6IHBpZCxcbiAgICAgIGNoaWxkcmVuOiBbXVxuICAgIH1cbiAgICBpZiAodGV4dCAmJiAnb2JqZWN0JyA9PT0gdHlwZW9mIHRleHQpIHtcbiAgICAgIG5vZGUuZGF0YSA9IHRleHRcbiAgICB9XG4gICAgdGhpcy5pZHNbbm9kZS5pZF0gPSBub2RlXG4gICAgdGhpcy5pZHNbcGlkXS5jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDAsIG5vZGUuaWQpXG5cbiAgICB2YXIgYmVmb3JlID0gZmFsc2VcbiAgICBpZiAoaW5kZXggPCB0aGlzLmlkc1twaWRdLmNoaWxkcmVuLmxlbmd0aCAtIDEpIHtcbiAgICAgIGJlZm9yZSA9IHRoaXMuaWRzW3BpZF0uY2hpbGRyZW5baW5kZXggKyAxXVxuICAgIH1cblxuICAgIHRoaXMuZGIuc2F2ZSgnbm9kZScsIG5vZGUuaWQsIG5vZGUpXG4gICAgdGhpcy5kYi51cGRhdGUoJ25vZGUnLCBwaWQsIHtjaGlsZHJlbjogdGhpcy5pZHNbcGlkXS5jaGlsZHJlbn0pXG5cbiAgICByZXR1cm4ge1xuICAgICAgbm9kZTogbm9kZSxcbiAgICAgIGJlZm9yZTogYmVmb3JlXG4gICAgfVxuICB9LFxuICByZW1vdmU6IGZ1bmN0aW9uIChpZCkge1xuICAgIGlmIChpZCA9PT0gdGhpcy5yb290KSByZXR1cm5cbiAgICB2YXIgbiA9IHRoaXMuaWRzW2lkXVxuICAgICAgLCBwID0gdGhpcy5pZHNbbi5wYXJlbnRdXG4gICAgICAsIGl4ID0gcC5jaGlsZHJlbi5pbmRleE9mKGlkKVxuICAgIHAuY2hpbGRyZW4uc3BsaWNlKGl4LCAxKVxuICAgIGRlbGV0ZSB0aGlzLmlkc1tpZF1cblxuICAgIHRoaXMuZGIucmVtb3ZlKCdub2RlJywgaWQpXG4gICAgdGhpcy5kYi51cGRhdGUoJ25vZGUnLCBuLnBhcmVudCwge2NoaWxkcmVuOiBwLmNoaWxkcmVufSlcbiAgICAvLyBUT0RPOiByZW1vdmUgYWxsIGNoaWxkIG5vZGVzXG5cbiAgICByZXR1cm4ge2lkOiBpZCwgbm9kZTogbiwgaXg6IGl4fVxuICB9LFxuICBzZXRBdHRyOiBmdW5jdGlvbiAoaWQsIGF0dHIsIHZhbHVlKSB7XG4gICAgdGhpcy5pZHNbaWRdLmRhdGFbYXR0cl0gPSB2YWx1ZVxuICAgIHRoaXMuZGIudXBkYXRlKCdub2RlJywgaWQsIHtkYXRhOiB0aGlzLmlkc1tpZF0uZGF0YX0pXG4gIH0sXG4gIHNldERhdGE6IGZ1bmN0aW9uIChpZCwgZGF0YSkge1xuICAgIGZvciAodmFyIG5hbWUgaW4gZGF0YSkge1xuICAgICAgdGhpcy5pZHNbaWRdLmRhdGFbbmFtZV0gPSBkYXRhW25hbWVdXG4gICAgfVxuICAgIHRoaXMuZGIudXBkYXRlKCdub2RlJywgaWQsIGRhdGEpXG4gIH0sXG5cbiAgLy8gb3RoZXIgc3R1ZmZcbiAgc2V0Q29sbGFwc2VkOiBmdW5jdGlvbiAoaWQsIGlzQ29sbGFwc2VkKSB7XG4gICAgdGhpcy5pZHNbaWRdLmNvbGxhcHNlZCA9IGlzQ29sbGFwc2VkXG4gICAgdGhpcy5kYi51cGRhdGUoJ25vZGUnLCBpZCwge2NvbGxhcHNlZDogaXNDb2xsYXBzZWR9KVxuICB9LFxuICBpc0NvbGxhcHNlZDogZnVuY3Rpb24gKGlkKSB7XG4gICAgcmV0dXJuIHRoaXMuaWRzW2lkXS5jb2xsYXBzZWRcbiAgfSxcbiAgaGFzQ2hpbGRyZW46IGZ1bmN0aW9uIChpZCkge1xuICAgIHJldHVybiB0aGlzLmlkc1tpZF0uY2hpbGRyZW4ubGVuZ3RoXG4gIH0sXG4gIC8vIGFkZCBiYWNrIHNvbWV0aGluZyB0aGF0IHdhcyByZW1vdmVkXG4gIHJlYWRkOiBmdW5jdGlvbiAoc2F2ZWQpIHtcbiAgICB0aGlzLmlkc1tzYXZlZC5pZF0gPSBzYXZlZC5ub2RlXG4gICAgdmFyIGNoaWxkcmVuID0gdGhpcy5pZHNbc2F2ZWQubm9kZS5wYXJlbnRdLmNoaWxkcmVuXG4gICAgY2hpbGRyZW4uc3BsaWNlKHNhdmVkLml4LCAwLCBzYXZlZC5pZClcbiAgICB2YXIgYmVmb3JlID0gZmFsc2VcbiAgICBpZiAoc2F2ZWQuaXggPCBjaGlsZHJlbi5sZW5ndGggLSAxKSB7XG4gICAgICBiZWZvcmUgPSBjaGlsZHJlbltzYXZlZC5peCArIDFdXG4gICAgfVxuICAgIHRoaXMuZGIuc2F2ZSgnbm9kZScsIHNhdmVkLm5vZGUuaWQsIHNhdmVkLm5vZGUpXG4gICAgdGhpcy5kYi51cGRhdGUoJ25vZGUnLCBzYXZlZC5ub2RlLnBhcmVudCwge2NoaWxkcmVuOiBjaGlsZHJlbn0pXG4gICAgcmV0dXJuIGJlZm9yZVxuICB9LFxuICBtb3ZlOiBmdW5jdGlvbiAoaWQsIHBpZCwgaW5kZXgpIHtcbiAgICB2YXIgbiA9IHRoaXMuaWRzW2lkXVxuICAgICAgLCBvcGlkID0gbi5wYXJlbnRcbiAgICAgICwgcCA9IHRoaXMuaWRzW29waWRdXG4gICAgICAsIGl4ID0gcC5jaGlsZHJlbi5pbmRleE9mKGlkKVxuICAgIHAuY2hpbGRyZW4uc3BsaWNlKGl4LCAxKVxuICAgIGlmIChpbmRleCA9PT0gZmFsc2UpIGluZGV4ID0gdGhpcy5pZHNbcGlkXS5jaGlsZHJlbi5sZW5ndGhcbiAgICB0aGlzLmlkc1twaWRdLmNoaWxkcmVuLnNwbGljZShpbmRleCwgMCwgaWQpXG4gICAgdGhpcy5pZHNbaWRdLnBhcmVudCA9IHBpZFxuXG4gICAgdGhpcy5kYi51cGRhdGUoJ25vZGUnLCBvcGlkLCB7Y2hpbGRyZW46IHAuY2hpbGRyZW59KVxuICAgIHRoaXMuZGIudXBkYXRlKCdub2RlJywgcGlkLCB7Y2hpbGRyZW46IHRoaXMuaWRzW3BpZF0uY2hpbGRyZW59KVxuICAgIHRoaXMuZGIudXBkYXRlKCdub2RlJywgaWQsIHtwYXJlbnQ6IHBpZH0pXG5cbiAgICB2YXIgYmVmb3JlID0gZmFsc2VcbiAgICBpZiAoaW5kZXggPCB0aGlzLmlkc1twaWRdLmNoaWxkcmVuLmxlbmd0aCAtIDEpIHtcbiAgICAgIGJlZm9yZSA9IHRoaXMuaWRzW3BpZF0uY2hpbGRyZW5baW5kZXggKyAxXVxuICAgIH1cbiAgICByZXR1cm4gYmVmb3JlXG4gIH0sXG4gIGFwcGVuZFRleHQ6IGZ1bmN0aW9uIChpZCwgdGV4dCkge1xuICAgIHRoaXMuaWRzW2lkXS5kYXRhLm5hbWUgKz0gdGV4dFxuICAgIHRoaXMuZGIudXBkYXRlKCdub2RlJywgaWQsIHtkYXRhOiB0aGlzLmlkc1tpZF0uZGF0YX0pXG4gIH0sXG5cbiAgLy8gbW92ZW1lbnQgY2FsY3VsYXRpb25cbiAgZ2V0UGFyZW50OiBmdW5jdGlvbiAoaWQpIHtcbiAgICByZXR1cm4gdGhpcy5pZHNbaWRdLnBhcmVudFxuICB9LFxuICBjb21tb25QYXJlbnQ6IGZ1bmN0aW9uIChvbmUsIHR3bykge1xuICAgIGlmIChvbmUgPT09IHR3bykgcmV0dXJuIG9uZVxuICAgIHZhciBvbmVzID0gW29uZV1cbiAgICAgICwgdHdvcyA9IFt0d29dXG4gICAgd2hpbGUgKHRoaXMuaWRzW29uZV0ucGFyZW50IHx8IHRoaXMuaWRzW3R3b10ucGFyZW50KSB7XG4gICAgICBpZiAodGhpcy5pZHNbb25lXS5wYXJlbnQpIHtcbiAgICAgICAgb25lID0gdGhpcy5pZHNbb25lXS5wYXJlbnRcbiAgICAgICAgaWYgKHR3b3MuaW5kZXhPZihvbmUpICE9PSAtMSkgcmV0dXJuIG9uZVxuICAgICAgICBvbmVzLnB1c2gob25lKVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuaWRzW3R3b10ucGFyZW50KSB7XG4gICAgICAgIHR3byA9IHRoaXMuaWRzW3R3b10ucGFyZW50XG4gICAgICAgIGlmIChvbmVzLmluZGV4T2YodHdvKSAhPT0gLTEpIHJldHVybiB0d29cbiAgICAgICAgdHdvcy5wdXNoKHR3bylcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGxcbiAgfSxcbiAgZ2V0Q2hpbGQ6IGZ1bmN0aW9uIChpZCkge1xuICAgIGlmICh0aGlzLmlkc1tpZF0uY2hpbGRyZW4gJiYgdGhpcy5pZHNbaWRdLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRoaXMuaWRzW2lkXS5jaGlsZHJlblswXVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5uZXh0U2libGluZyhpZClcbiAgfSxcbiAgcHJldlNpYmxpbmc6IGZ1bmN0aW9uIChpZCwgbm9wYXJlbnQpIHtcbiAgICB2YXIgcGlkID0gdGhpcy5pZHNbaWRdLnBhcmVudFxuICAgIGlmICh1bmRlZmluZWQgPT09IHBpZCkgcmV0dXJuXG4gICAgdmFyIGl4ID0gdGhpcy5pZHNbcGlkXS5jaGlsZHJlbi5pbmRleE9mKGlkKVxuICAgIGlmIChpeCA+IDApIHJldHVybiB0aGlzLmlkc1twaWRdLmNoaWxkcmVuW2l4LTFdXG4gICAgaWYgKCFub3BhcmVudCkgcmV0dXJuIHBpZFxuICB9LFxuICBuZXh0U2libGluZzogZnVuY3Rpb24gKGlkLCBzdHJpY3QpIHtcbiAgICB2YXIgcGlkID0gdGhpcy5pZHNbaWRdLnBhcmVudFxuICAgIGlmICh1bmRlZmluZWQgPT09IHBpZCkgcmV0dXJuICFzdHJpY3QgJiYgdGhpcy5pZHNbaWRdLmNoaWxkcmVuWzBdXG4gICAgdmFyIGl4ID0gdGhpcy5pZHNbcGlkXS5jaGlsZHJlbi5pbmRleE9mKGlkKVxuICAgIGlmIChpeCA8IHRoaXMuaWRzW3BpZF0uY2hpbGRyZW4ubGVuZ3RoIC0gMSkgcmV0dXJuIHRoaXMuaWRzW3BpZF0uY2hpbGRyZW5baXggKyAxXVxuICAgIGlmICh0aGlzLmlkc1tpZF0uY29sbGFwc2VkKSB7XG4gICAgICByZXR1cm4gIXN0cmljdCAmJiB0aGlzLm5leHRTaWJsaW5nKHBpZCwgc3RyaWN0KVxuICAgIH1cbiAgICByZXR1cm4gIXN0cmljdCAmJiB0aGlzLmlkc1tpZF0uY2hpbGRyZW5bMF1cbiAgfSxcbiAgbGFzdFNpYmxpbmc6IGZ1bmN0aW9uIChpZCwgc3RyaWN0KSB7XG4gICAgdmFyIHBpZCA9IHRoaXMuaWRzW2lkXS5wYXJlbnRcbiAgICBpZiAodW5kZWZpbmVkID09PSBwaWQpIHJldHVybiAhc3RyaWN0ICYmIHRoaXMuaWRzW2lkXS5jaGlsZHJlblswXVxuICAgIHZhciBpeCA9IHRoaXMuaWRzW3BpZF0uY2hpbGRyZW4uaW5kZXhPZihpZClcbiAgICBpZiAoaXggPT09IHRoaXMuaWRzW3BpZF0uY2hpbGRyZW4ubGVuZ3RoIC0gMSkgcmV0dXJuICFzdHJpY3QgJiYgdGhpcy5pZHNbaWRdLmNoaWxkcmVuWzBdXG4gICAgcmV0dXJuIHRoaXMuaWRzW3BpZF0uY2hpbGRyZW5bdGhpcy5pZHNbcGlkXS5jaGlsZHJlbi5sZW5ndGggLSAxXVxuICB9LFxuICBmaXJzdFNpYmxpbmc6IGZ1bmN0aW9uIChpZCwgc3RyaWN0KSB7XG4gICAgdmFyIHBpZCA9IHRoaXMuaWRzW2lkXS5wYXJlbnRcbiAgICBpZiAodW5kZWZpbmVkID09PSBwaWQpIHJldHVybiAvLyB0aGlzLmlkc1tpZF0uY2hpbGRyZW5bMF1cbiAgICB2YXIgaXggPSB0aGlzLmlkc1twaWRdLmNoaWxkcmVuLmluZGV4T2YoaWQpXG4gICAgaWYgKGl4ID09PSAwKSByZXR1cm4gIXN0cmljdCAmJiBwaWRcbiAgICByZXR1cm4gdGhpcy5pZHNbcGlkXS5jaGlsZHJlblswXVxuICB9LFxuICBsYXN0T3BlbjogZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIG5vZGUgPSB0aGlzLmlkc1tpZF1cbiAgICB3aGlsZSAobm9kZS5jaGlsZHJlbi5sZW5ndGggJiYgKG5vZGUuaWQgPT09IGlkIHx8ICFub2RlLmNvbGxhcHNlZCkpIHtcbiAgICAgIG5vZGUgPSB0aGlzLmlkc1tub2RlLmNoaWxkcmVuW25vZGUuY2hpbGRyZW4ubGVuZ3RoIC0gMV1dXG4gICAgfVxuICAgIHJldHVybiBub2RlLmlkXG4gIH0sXG4gIGlkQWJvdmU6IGZ1bmN0aW9uIChpZCkge1xuICAgIHZhciBwaWQgPSB0aGlzLmlkc1tpZF0ucGFyZW50XG4gICAgICAsIHBhcmVudCA9IHRoaXMuaWRzW3BpZF1cbiAgICBpZiAoIXBhcmVudCkgcmV0dXJuXG4gICAgdmFyIGl4ID0gcGFyZW50LmNoaWxkcmVuLmluZGV4T2YoaWQpXG4gICAgaWYgKGl4ID09PSAwKSB7XG4gICAgICByZXR1cm4gcGlkXG4gICAgfVxuICAgIHZhciBwcmV2aWQgPSBwYXJlbnQuY2hpbGRyZW5baXggLSAxXVxuICAgIHdoaWxlICh0aGlzLmlkc1twcmV2aWRdLmNoaWxkcmVuICYmXG4gICAgICAgICAgIHRoaXMuaWRzW3ByZXZpZF0uY2hpbGRyZW4ubGVuZ3RoICYmXG4gICAgICAgICAgICF0aGlzLmlkc1twcmV2aWRdLmNvbGxhcHNlZCkge1xuICAgICAgcHJldmlkID0gdGhpcy5pZHNbcHJldmlkXS5jaGlsZHJlblt0aGlzLmlkc1twcmV2aWRdLmNoaWxkcmVuLmxlbmd0aCAtIDFdXG4gICAgfVxuICAgIHJldHVybiBwcmV2aWRcbiAgfSxcbiAgLy8gZ2V0IHRoZSBwbGFjZSB0byBzaGlmdCBsZWZ0IHRvXG4gIHNoaWZ0TGVmdFBsYWNlOiBmdW5jdGlvbiAoaWQpIHtcbiAgICB2YXIgcGlkID0gdGhpcy5pZHNbaWRdLnBhcmVudFxuICAgICAgLCBwYXJlbnQgPSB0aGlzLmlkc1twaWRdXG4gICAgaWYgKCFwYXJlbnQpIHJldHVyblxuICAgIHZhciBwcGlkID0gcGFyZW50LnBhcmVudFxuICAgICAgLCBwcGFyZW50ID0gdGhpcy5pZHNbcHBpZF1cbiAgICBpZiAoIXBwYXJlbnQpIHJldHVyblxuICAgIHZhciBwaXggPSBwcGFyZW50LmNoaWxkcmVuLmluZGV4T2YocGlkKVxuICAgIHJldHVybiB7XG4gICAgICBwaWQ6IHBwaWQsXG4gICAgICBpeDogcGl4ICsgMVxuICAgIH1cbiAgfSxcbiAgc2hpZnRVcFBsYWNlOiBmdW5jdGlvbiAoaWQpIHtcbiAgICB2YXIgcGlkID0gdGhpcy5pZHNbaWRdLnBhcmVudFxuICAgICAgLCBwYXJlbnQgPSB0aGlzLmlkc1twaWRdXG4gICAgaWYgKCFwYXJlbnQpIHJldHVyblxuICAgIHZhciBpeCA9IHBhcmVudC5jaGlsZHJlbi5pbmRleE9mKGlkKVxuICAgIGlmIChpeCA9PT0gMCkge1xuICAgICAgdmFyIHBsID0gdGhpcy5zaGlmdExlZnRQbGFjZShpZClcbiAgICAgIGlmICghcGwpIHJldHVyblxuICAgICAgcGwuaXggLT0gMVxuICAgICAgcmV0dXJuIHBsXG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBwaWQ6IHBpZCxcbiAgICAgIGl4OiBpeCAtIDFcbiAgICB9XG4gIH0sXG4gIHNoaWZ0RG93blBsYWNlOiBmdW5jdGlvbiAoaWQpIHtcbiAgICB2YXIgcGlkID0gdGhpcy5pZHNbaWRdLnBhcmVudFxuICAgICAgLCBwYXJlbnQgPSB0aGlzLmlkc1twaWRdXG4gICAgaWYgKCFwYXJlbnQpIHJldHVyblxuICAgIHZhciBpeCA9IHBhcmVudC5jaGlsZHJlbi5pbmRleE9mKGlkKVxuICAgIGlmIChpeCA+PSBwYXJlbnQuY2hpbGRyZW4ubGVuZ3RoIC0gMSkge1xuICAgICAgcmV0dXJuIHRoaXMuc2hpZnRMZWZ0UGxhY2UoaWQpXG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBwaWQ6IHBpZCxcbiAgICAgIGl4OiBpeCArIDFcbiAgICB9XG4gIH0sXG4gIG1vdmVCZWZvcmVQbGFjZTogZnVuY3Rpb24gKGlkLCB0aWQpIHtcbiAgICB2YXIgc2liID0gdGhpcy5pZHNbaWRdXG4gICAgICAsIHBpZCA9IHNpYi5wYXJlbnRcbiAgICAgICwgb3BpZCA9IHRoaXMuaWRzW3RpZF0ucGFyZW50XG4gICAgaWYgKHVuZGVmaW5lZCA9PT0gcGlkKSByZXR1cm5cbiAgICB2YXIgcGFyZW50ID0gdGhpcy5pZHNbcGlkXVxuICAgIHJldHVybiB7XG4gICAgICBwaWQ6IHBpZCxcbiAgICAgIGl4OiBwYXJlbnQuY2hpbGRyZW4uaW5kZXhPZihpZClcbiAgICB9XG4gIH0sXG4gIG1vdmVBZnRlclBsYWNlOiBmdW5jdGlvbiAoaWQsIG9pZCkge1xuICAgIHZhciBzaWIgPSB0aGlzLmlkc1tpZF1cbiAgICAgICwgcGlkID0gc2liLnBhcmVudFxuICAgICAgLCBvcGlkID0gdGhpcy5pZHNbb2lkXS5wYXJlbnRcbiAgICBpZiAodW5kZWZpbmVkID09PSBwaWQpIHJldHVyblxuICAgIHZhciBvaXggPSB0aGlzLmlkc1tvcGlkXS5jaGlsZHJlbi5pbmRleE9mKG9pZClcbiAgICB2YXIgcGFyZW50ID0gdGhpcy5pZHNbcGlkXVxuICAgICAgLCBpeCA9IHBhcmVudC5jaGlsZHJlbi5pbmRleE9mKGlkKSArIDFcbiAgICBpZiAoIHBpZCA9PT0gb3BpZCAmJiBpeCA+IG9peCkgaXggLT0gMVxuICAgIHJldHVybiB7XG4gICAgICBwaWQ6IHBpZCxcbiAgICAgIGl4OiBpeFxuICAgIH1cbiAgfSxcbiAgaWRCZWxvdzogZnVuY3Rpb24gKGlkLCByb290KSB7XG4gICAgaWYgKHRoaXMuaWRzW2lkXS5jaGlsZHJlbiAmJlxuICAgICAgICB0aGlzLmlkc1tpZF0uY2hpbGRyZW4ubGVuZ3RoICYmXG4gICAgICAgIChpZCA9PT0gcm9vdCB8fCAhdGhpcy5pZHNbaWRdLmNvbGxhcHNlZCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmlkc1tpZF0uY2hpbGRyZW5bMF1cbiAgICB9XG4gICAgdmFyIHBpZCA9IHRoaXMuaWRzW2lkXS5wYXJlbnRcbiAgICAgICwgcGFyZW50ID0gdGhpcy5pZHNbcGlkXVxuICAgIGlmICghcGFyZW50KSByZXR1cm5cbiAgICB2YXIgaXggPSBwYXJlbnQuY2hpbGRyZW4uaW5kZXhPZihpZClcbiAgICB3aGlsZSAoaXggPT09IHBhcmVudC5jaGlsZHJlbi5sZW5ndGggLSAxKSB7XG4gICAgICBwYXJlbnQgPSB0aGlzLmlkc1twYXJlbnQucGFyZW50XVxuICAgICAgaWYgKCFwYXJlbnQpIHJldHVyblxuICAgICAgaXggPSBwYXJlbnQuY2hpbGRyZW4uaW5kZXhPZihwaWQpXG4gICAgICBwaWQgPSBwYXJlbnQuaWRcbiAgICB9XG4gICAgcmV0dXJuIHBhcmVudC5jaGlsZHJlbltpeCArIDFdXG4gIH0sXG4gIGlkTmV3OiBmdW5jdGlvbiAoaWQsIGJlZm9yZSwgcm9vdCkge1xuICAgIHZhciBwaWQgPSB0aGlzLmlkc1tpZF0ucGFyZW50XG4gICAgICAsIHBhcmVudFxuICAgICAgLCBuaXhcbiAgICBpZiAoYmVmb3JlKSB7XG4gICAgICBwYXJlbnQgPSB0aGlzLmlkc1twaWRdXG4gICAgICBuaXggPSBwYXJlbnQuY2hpbGRyZW4uaW5kZXhPZihpZClcbiAgICB9IGVsc2UgaWYgKGlkID09PSB0aGlzLnJvb3QgfHxcbiAgICAgICAgcm9vdCA9PT0gaWQgfHxcbiAgICAgICAgKHRoaXMuaWRzW2lkXS5jaGlsZHJlbiAmJlxuICAgICAgICB0aGlzLmlkc1tpZF0uY2hpbGRyZW4ubGVuZ3RoICYmXG4gICAgICAgICF0aGlzLmlkc1tpZF0uY29sbGFwc2VkKSkge1xuICAgICAgcGlkID0gaWRcbiAgICAgIG5peCA9IDBcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyZW50ID0gdGhpcy5pZHNbcGlkXVxuICAgICAgbml4ID0gcGFyZW50LmNoaWxkcmVuLmluZGV4T2YoaWQpICsgMVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgcGlkOiBwaWQsXG4gICAgICBpbmRleDogbml4XG4gICAgfVxuICB9LFxuICBzYW1lUGxhY2U6IGZ1bmN0aW9uIChpZCwgcGxhY2UpIHtcbiAgICB2YXIgcGlkID0gdGhpcy5pZHNbaWRdLnBhcmVudFxuICAgIGlmICghcGlkIHx8IHBpZCAhPT0gcGxhY2UucGlkKSByZXR1cm4gZmFsc2VcbiAgICB2YXIgcGFyZW50ID0gdGhpcy5pZHNbcGlkXVxuICAgICAgLCBpeCA9IHBhcmVudC5jaGlsZHJlbi5pbmRleE9mKGlkKVxuICAgIHJldHVybiBpeCA9PT0gcGxhY2UuaXhcbiAgfSxcbiAgZmluZENvbGxhcHNlcjogZnVuY3Rpb24gKGlkKSB7XG4gICAgaWYgKCghdGhpcy5pZHNbaWRdLmNoaWxkcmVuIHx8XG4gICAgICAgICAhdGhpcy5pZHNbaWRdLmNoaWxkcmVuLmxlbmd0aCB8fFxuICAgICAgICAgdGhpcy5pZHNbaWRdLmNvbGxhcHNlZCkgJiZcbiAgICAgICAgdGhpcy5pZHNbaWRdLnBhcmVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZCA9IHRoaXMuaWRzW2lkXS5wYXJlbnRcbiAgICB9XG4gICAgcmV0dXJuIGlkXG4gIH0sXG59XG5cbiIsIlxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGV4dGVuZDogZXh0ZW5kLFxuICBtZXJnZTogbWVyZ2UsXG4gIG1ha2VfbGlzdGVkOiBtYWtlX2xpc3RlZFxufVxuXG5mdW5jdGlvbiBtZXJnZShhLCBiKSB7XG4gIHZhciBjID0ge31cbiAgICAsIG5hbWVcbiAgZm9yIChuYW1lIGluIGEpIHtcbiAgICBjW25hbWVdID0gYVtuYW1lXVxuICB9XG4gIGZvciAobmFtZSBpbiBiKSB7XG4gICAgY1tuYW1lXSA9IGJbbmFtZV1cbiAgfVxuICByZXR1cm4gY1xufVxuXG5mdW5jdGlvbiBleHRlbmQoZGVzdCkge1xuICBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkuZm9yRWFjaChmdW5jdGlvbiAoc3JjKSB7XG4gICAgZm9yICh2YXIgYXR0ciBpbiBzcmMpIHtcbiAgICAgICAgZGVzdFthdHRyXSA9IHNyY1thdHRyXVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIGRlc3Rcbn1cblxuZnVuY3Rpb24gbG9hZChkYiwgdHJlZSkge1xuICB2YXIgcmVzID0gbWFrZV9saXN0ZWQodHJlZSwgdW5kZWZpbmVkLCB0cnVlKVxuICBkYi5zYXZlKCdyb290Jywge2lkOiByZXMuaWR9KVxuICBmb3IgKHZhciBpPTA7IGk8cmVzLnRyZWUubGVuZ3RoOyBpKyspIHtcbiAgICBkYi5zYXZlKCdub2RlJywgcmVzLnRyZWVbaV0pXG4gIH1cbn1cblxuZnVuY3Rpb24gbWFrZV9saXN0ZWQoZGF0YSwgbmV4dGlkLCBjb2xsYXBzZSkge1xuICB2YXIgaWRzID0ge31cbiAgICAsIGNoaWxkcmVuID0gW11cbiAgICAsIG5kYXRhID0ge31cbiAgICAsIHJlc1xuICAgICwgaVxuICBpZiAodW5kZWZpbmVkID09PSBuZXh0aWQpIG5leHRpZCA9IDEwMFxuXG4gIGlmIChkYXRhLmNoaWxkcmVuKSB7XG4gICAgZm9yIChpPTA7IGk8ZGF0YS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgcmVzID0gbWFrZV9saXN0ZWQoZGF0YS5jaGlsZHJlbltpXSwgbmV4dGlkLCBjb2xsYXBzZSlcbiAgICAgIGZvciAodmFyIGlkIGluIHJlcy50cmVlKSB7XG4gICAgICAgIGlkc1tpZF0gPSByZXMudHJlZVtpZF1cbiAgICAgICAgaWRzW2lkXS5kZXB0aCArPSAxXG4gICAgICB9XG4gICAgICBjaGlsZHJlbi5wdXNoKHJlcy5pZClcbiAgICAgIG5leHRpZCA9IHJlcy5pZCArIDFcbiAgICB9XG4gICAgLy8gZGVsZXRlIGRhdGEuY2hpbGRyZW5cbiAgfVxuICBmb3IgKHZhciBuYW1lIGluIGRhdGEpIHtcbiAgICBpZiAobmFtZSA9PT0gJ2NoaWxkcmVuJykgY29udGludWU7XG4gICAgbmRhdGFbbmFtZV0gPSBkYXRhW25hbWVdXG4gIH1cbiAgbmRhdGEuZG9uZSA9IGZhbHNlXG4gIHZhciB0aGVpZCA9IGRhdGEuaWQgfHwgbmV4dGlkXG4gIGlkc1t0aGVpZF0gPSB7XG4gICAgaWQ6IHRoZWlkLFxuICAgIGRhdGE6IG5kYXRhLFxuICAgIGNoaWxkcmVuOiBjaGlsZHJlbixcbiAgICBjb2xsYXBzZWQ6ICEhY29sbGFwc2UsXG4gICAgZGVwdGg6IDBcbiAgfVxuICBmb3IgKGk9MDsgaTxjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgIGlkc1tjaGlsZHJlbltpXV0ucGFyZW50ID0gdGhlaWQ7XG4gIH1cbiAgcmV0dXJuIHtpZDogdGhlaWQsIHRyZWU6IGlkc31cbn1cblxuXG5cbiIsIlxubW9kdWxlLmV4cG9ydHMgPSBWaWV3XG5cbmZ1bmN0aW9uIHJldmVyc2VkKGl0ZW1zKSB7XG4gIHZhciBudyA9IFtdXG4gIGZvciAodmFyIGk9aXRlbXMubGVuZ3RoOyBpPjA7IGktLSkge1xuICAgIG53LnB1c2goaXRlbXNbaSAtIDFdKVxuICB9XG4gIHJldHVybiBud1xufVxuXG52YXIgRG9tVmlld0xheWVyID0gcmVxdWlyZSgnLi9kb20tdmwnKVxuICAsIERlZmF1bHROb2RlID0gcmVxdWlyZSgnLi9kZWZhdWx0LW5vZGUnKVxuICAsIER1bmdlb25zQW5kRHJhZ29ucyA9IHJlcXVpcmUoJy4vZG5kJylcbiAgLCBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJylcbiAgLCB1dGlsID0gcmVxdWlyZSgnLi91dGlsJylcblxuZnVuY3Rpb24gVmlldyhiaW5kQWN0aW9ucywgbW9kZWwsIGN0cmwsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgdGhpcy5tb2RlID0gJ25vcm1hbCdcbiAgdGhpcy5zZWxlY3Rpb24gPSBudWxsXG4gIHRoaXMuc2VsX2ludmVydGVkID0gZmFsc2VcbiAgdGhpcy5hY3RpdmUgPSBudWxsXG4gIHRoaXMubyA9IHV0aWwuZXh0ZW5kKHtcbiAgICBub2RlOiBEZWZhdWx0Tm9kZSxcbiAgICBWaWV3TGF5ZXI6IERvbVZpZXdMYXllcixcbiAgICBub1NlbGVjdFJvb3Q6IGZhbHNlXG4gIH0sIG9wdGlvbnMpXG4gIHRoaXMuby5rZXliaW5kaW5ncyA9IHV0aWwubWVyZ2UodGhpcy5kZWZhdWx0X2tleXMsIG9wdGlvbnMua2V5cylcbiAgdGhpcy52bCA9IG5ldyB0aGlzLm8uVmlld0xheWVyKHRoaXMubylcbiAgdGhpcy5iaW5kQWN0aW9ucyA9IGJpbmRBY3Rpb25zXG4gIHRoaXMubW9kZWwgPSBtb2RlbFxuICB0aGlzLmN0cmwgPSBjdHJsXG4gIHRoaXMuZG5kID0gbmV3IER1bmdlb25zQW5kRHJhZ29ucyh0aGlzLnZsLCBjdHJsLmFjdGlvbnMubW92ZS5iaW5kKGN0cmwpKVxuICB0aGlzLmxhenlfY2hpbGRyZW4gPSB7fVxuXG4gIHRoaXMubmV3Tm9kZSA9IG51bGxcbiAgdGhpcy5hdHRhY2hMaXN0ZW5lcnMoKVxufVxuXG5WaWV3LnByb3RvdHlwZSA9IHtcbiAgcmViYXNlOiBmdW5jdGlvbiAobmV3cm9vdCwgdHJpZ2dlcikge1xuICAgIHRoaXMudmwuY2xlYXIoKVxuICAgIHZhciByb290ID0gdGhpcy52bC5yb290XG4gICAgdGhpcy5pbml0aWFsaXplKG5ld3Jvb3QpXG4gICAgdGhpcy52bC5yZWJhc2Uocm9vdClcbiAgICB0aGlzLmN0cmwudHJpZ2dlcigncmViYXNlJywgbmV3cm9vdClcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKHJvb3QpIHtcbiAgICB2YXIgbm9kZSA9IHRoaXMubW9kZWwuaWRzW3Jvb3RdXG4gICAgICAsIHJvb3ROb2RlID0gdGhpcy52bC5tYWtlUm9vdChub2RlLCB0aGlzLmJpbmRBY3Rpb25zKHJvb3QpKVxuICAgIHRoaXMuYWN0aXZlID0gbnVsbFxuICAgIHRoaXMuc2VsZWN0aW9uID0gbnVsbFxuICAgIHRoaXMubGF6eV9jaGlsZHJlbiA9IHt9XG4gICAgdGhpcy5yb290ID0gcm9vdFxuICAgIHRoaXMucG9wdWxhdGVDaGlsZHJlbihyb290KVxuICAgIGlmICghbm9kZS5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgIHRoaXMuYWRkTmV3KHRoaXMucm9vdCwgMClcbiAgICB9XG4gICAgdGhpcy5zZWxlY3RTb21ldGhpbmcoKVxuICAgIHJldHVybiByb290Tm9kZVxuICB9LFxuICBzdGFydE1vdmluZzogZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIHRhcmdldHMgPSB0aGlzLnZsLmRyb3BUYXJnZXRzKHRoaXMucm9vdCwgdGhpcy5tb2RlbCwgaWQsIHRydWUpXG4gICAgdGhpcy5kbmQuc3RhcnRNb3ZpbmcodGFyZ2V0cywgaWQpXG4gIH0sXG4gIGFkZE5ldzogZnVuY3Rpb24gKHBpZCwgaW5kZXgpIHtcbiAgICB0aGlzLm5ld05vZGUgPSB7XG4gICAgICBwaWQ6IHBpZCxcbiAgICAgIGluZGV4OiBpbmRleFxuICAgIH1cbiAgICB2YXIgYmVmb3JlID0gdGhpcy5tb2RlbC5nZXRCZWZvcmUocGlkLCBpbmRleC0xKVxuICAgIHRoaXMudmwuYWRkTmV3KHtcbiAgICAgIGlkOiAnbmV3JyxcbiAgICAgIGRhdGE6IHtuYW1lOiAnJ30sXG4gICAgICBwYXJlbnQ6IHBpZFxuICAgIH0sIHRoaXMuYmluZEFjdGlvbnMoJ25ldycpLCBiZWZvcmUpXG4gIH0sXG4gIHJlbW92ZU5ldzogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5uZXdOb2RlKSByZXR1cm4gZmFsc2VcbiAgICB2YXIgbncgPSB0aGlzLm5ld05vZGVcbiAgICAgICwgbGFzdGNoaWxkID0gIXRoaXMubW9kZWwuaWRzW253LnBpZF0uY2hpbGRyZW4ubGVuZ3RoXG4gICAgdGhpcy52bC5yZW1vdmUoJ25ldycsIG53LnBpZCwgbGFzdGNoaWxkKVxuICAgIHRoaXMubmV3Tm9kZSA9IG51bGxcbiAgICByZXR1cm4gbndcbiAgfSxcbiAgc2VsZWN0U29tZXRoaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNoaWxkXG4gICAgaWYgKCF0aGlzLm1vZGVsLmlkc1t0aGlzLnJvb3RdLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgY2hpbGQgPSAnbmV3J1xuICAgIH0gZWxzZSB7XG4gICAgICBjaGlsZCA9IHRoaXMubW9kZWwuaWRzW3RoaXMucm9vdF0uY2hpbGRyZW5bMF1cbiAgICB9XG4gICAgdGhpcy5nb1RvKGNoaWxkKVxuICB9LFxuICBwb3B1bGF0ZUNoaWxkcmVuOiBmdW5jdGlvbiAoaWQpIHtcbiAgICB2YXIgbm9kZSA9IHRoaXMubW9kZWwuaWRzW2lkXVxuICAgIGlmIChub2RlLmNvbGxhcHNlZCAmJiBpZCAhPT0gdGhpcy5yb290KSB7XG4gICAgICB0aGlzLmxhenlfY2hpbGRyZW5baWRdID0gdHJ1ZVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRoaXMubGF6eV9jaGlsZHJlbltpZF0gPSBmYWxzZVxuICAgIGlmICghbm9kZS5jaGlsZHJlbiB8fCAhbm9kZS5jaGlsZHJlbi5sZW5ndGgpIHJldHVyblxuICAgIGZvciAodmFyIGk9MDsgaTxub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLmFkZCh0aGlzLm1vZGVsLmlkc1tub2RlLmNoaWxkcmVuW2ldXSwgZmFsc2UsIHRydWUpXG4gICAgICB0aGlzLnBvcHVsYXRlQ2hpbGRyZW4obm9kZS5jaGlsZHJlbltpXSlcbiAgICB9XG4gIH0sXG4gIGdvVG86IGZ1bmN0aW9uIChpZCkge1xuICAgIGlmICh0aGlzLm1vZGUgPT09ICdpbnNlcnQnKSB7XG4gICAgICB0aGlzLnN0YXJ0RWRpdGluZyhpZClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRBY3RpdmUoaWQpXG4gICAgfVxuICB9LFxuXG4gIGRlZmF1bHRfa2V5czoge1xuICAgICdjdXQnOiAnY3RybCt4LCBkZWxldGUsIGQgZCcsXG4gICAgJ2NvcHknOiAnY3RybCtjLCB5IHknLFxuICAgICdwYXN0ZSc6ICdwLCBjdHJsK3YnLFxuICAgICdwYXN0ZSBhYm92ZSc6ICdzaGlmdCtwLCBjdHJsK3NoaWZ0K3YnLFxuICAgICd2aXN1YWwgbW9kZSc6ICd2LCBzaGlmdCt2JyxcblxuICAgICdlZGl0JzogJ3JldHVybiwgYSwgc2hpZnQrYSwgZjInLFxuICAgICdlZGl0IHN0YXJ0JzogJ2ksIHNoaWZ0K2knLFxuICAgICdmaXJzdCBzaWJsaW5nJzogJ3NoaWZ0K1snLFxuICAgICdsYXN0IHNpYmxpbmcnOiAnc2hpZnQrXScsXG4gICAgJ21vdmUgdG8gZmlyc3Qgc2libGluZyc6ICdzaGlmdCthbHQrWycsXG4gICAgJ21vdmUgdG8gbGFzdCBzaWJsaW5nJzogJ3NoaWZ0K2FsdCtdJyxcbiAgICAnbmV3IGFmdGVyJzogJ28nLFxuICAgICduZXcgYmVmb3JlJzogJ3NoaWZ0K28nLFxuICAgICdqdW1wIHRvIHRvcCc6ICdnIGcnLFxuICAgICdqdW1wIHRvIGJvdHRvbSc6ICdzaGlmdCtnJyxcbiAgICAndXAnOiAndXAsIGsnLFxuICAgICdkb3duJzogJ2Rvd24sIGonLFxuICAgICdsZWZ0JzogJ2xlZnQsIGgnLFxuICAgICdyaWdodCc6ICdyaWdodCwgbCcsXG4gICAgJ25leHQgc2libGluZyc6ICdhbHQraiwgYWx0K2Rvd24nLFxuICAgICdwcmV2IHNpYmxpbmcnOiAnYWx0K2ssIGFsdCt1cCcsXG4gICAgJ3RvZ2dsZSBjb2xsYXBzZSc6ICd6JyxcbiAgICAnY29sbGFwc2UnOiAnYWx0K2gsIGFsdCtsZWZ0JyxcbiAgICAndW5jb2xsYXBzZSc6ICdhbHQrbCwgYWx0K3JpZ2h0JyxcbiAgICAnaW5kZW50JzogJ3RhYiwgc2hpZnQrYWx0K2wsIHNoaWZ0K2FsdCtyaWdodCcsXG4gICAgJ2RlZGVudCc6ICdzaGlmdCt0YWIsIHNoaWZ0K2FsdCtoLCBzaGlmdCthbHQrbGVmdCcsXG4gICAgJ21vdmUgZG93bic6ICdzaGlmdCthbHQraiwgc2hpZnQrYWx0K2Rvd24nLFxuICAgICdtb3ZlIHVwJzogJ3NoaWZ0K2FsdCtrLCBzaGlmdCthbHQraSwgc2hpZnQrYWx0K3VwJyxcbiAgICAndW5kbyc6ICdjdHJsK3osIHUnLFxuICAgICdyZWRvJzogJ2N0cmwrc2hpZnQreiwgc2hpZnQrcicsXG4gIH0sXG5cbiAgYWN0aW9uczoge1xuICAgICdjdXQnOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5hY3RpdmUgPT09IG51bGwpIHJldHVyblxuICAgICAgdGhpcy5jdHJsLmFjdGlvbnMuY3V0KHRoaXMuYWN0aXZlKVxuICAgIH0sXG4gICAgJ2NvcHknOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5hY3RpdmUgPT09IG51bGwpIHJldHVyblxuICAgICAgdGhpcy5jdHJsLmFjdGlvbnMuY29weSh0aGlzLmFjdGl2ZSlcbiAgICB9LFxuICAgICdwYXN0ZSc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLmFjdGl2ZSA9PT0gbnVsbCkgcmV0dXJuXG4gICAgICB0aGlzLmN0cmwuYWN0aW9ucy5wYXN0ZSh0aGlzLmFjdGl2ZSlcbiAgICB9LFxuICAgICdwYXN0ZSBhYm92ZSc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLmFjdGl2ZSA9PT0gbnVsbCkgcmV0dXJuXG4gICAgICB0aGlzLmN0cmwuYWN0aW9ucy5wYXN0ZSh0aGlzLmFjdGl2ZSwgdHJ1ZSlcbiAgICB9LFxuICAgICd2aXN1YWwgbW9kZSc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLmFjdGl2ZSA9PT0gdGhpcy5yb290KSByZXR1cm5cbiAgICAgIHRoaXMuc2V0U2VsZWN0aW9uKFt0aGlzLmFjdGl2ZV0pXG4gICAgfSxcblxuICAgICd1bmRvJzogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5jdHJsLnVuZG8oKTtcbiAgICB9LFxuICAgICdyZWRvJzogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5jdHJsLnJlZG8oKTtcbiAgICB9LFxuICAgICdlZGl0JzogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMuYWN0aXZlID09PSBudWxsKSB7XG4gICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5yb290XG4gICAgICB9XG4gICAgICB0aGlzLnZsLmJvZHkodGhpcy5hY3RpdmUpLnN0YXJ0RWRpdGluZygpXG4gICAgfSxcbiAgICAnZWRpdCBzdGFydCc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLmFjdGl2ZSA9PT0gbnVsbCkge1xuICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMucm9vdFxuICAgICAgfVxuICAgICAgdGhpcy52bC5ib2R5KHRoaXMuYWN0aXZlKS5zdGFydEVkaXRpbmcodHJ1ZSlcbiAgICB9LFxuICAgIC8vIG5hdlxuICAgICdmaXJzdCBzaWJsaW5nJzogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMuYWN0aXZlID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldEFjdGl2ZSh0aGlzLnJvb3QpXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5hY3RpdmUgPT09ICduZXcnKSByZXR1cm4gdGhpcy5zZXRBY3RpdmUodGhpcy5yb290KVxuICAgICAgdmFyIGZpcnN0ID0gdGhpcy5tb2RlbC5maXJzdFNpYmxpbmcodGhpcy5hY3RpdmUpXG4gICAgICBpZiAodW5kZWZpbmVkID09PSBmaXJzdCkgcmV0dXJuXG4gICAgICB0aGlzLnNldEFjdGl2ZShmaXJzdClcbiAgICB9LFxuICAgICdsYXN0IHNpYmxpbmcnOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5hY3RpdmUgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0QWN0aXZlKHRoaXMucm9vdClcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmFjdGl2ZSA9PT0gJ25ldycpIHJldHVybiB0aGlzLnNldEFjdGl2ZSh0aGlzLnJvb3QpXG4gICAgICB2YXIgbGFzdCA9IHRoaXMubW9kZWwubGFzdFNpYmxpbmcodGhpcy5hY3RpdmUpXG4gICAgICBpZiAodW5kZWZpbmVkID09PSBsYXN0KSByZXR1cm5cbiAgICAgIHRoaXMuc2V0QWN0aXZlKGxhc3QpXG4gICAgfSxcbiAgICAnanVtcCB0byB0b3AnOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnNldEFjdGl2ZSh0aGlzLnJvb3QpXG4gICAgfSxcbiAgICAnanVtcCB0byBib3R0b20nOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnNldEFjdGl2ZSh0aGlzLm1vZGVsLmxhc3RPcGVuKHRoaXMucm9vdCkpXG4gICAgICBjb25zb2xlLmxvZygnYm90dG9tJylcbiAgICAgIC8vIHBhc3NcbiAgICB9LFxuICAgICd1cCc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLmFjdGl2ZSA9PT0gbnVsbCkge1xuICAgICAgICB0aGlzLnNldEFjdGl2ZSh0aGlzLnJvb3QpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5hY3RpdmUgPT09ICduZXcnKSByZXR1cm4gdGhpcy5zZXRBY3RpdmUodGhpcy5yb290KVxuICAgICAgICB2YXIgdG9wID0gdGhpcy5hY3RpdmVcbiAgICAgICAgICAsIGFib3ZlID0gdGhpcy5tb2RlbC5pZEFib3ZlKHRvcClcbiAgICAgICAgaWYgKGFib3ZlID09PSB1bmRlZmluZWQpIGFib3ZlID0gdG9wXG4gICAgICAgIGlmIChhYm92ZSA9PT0gdGhpcy5yb290ICYmIHRoaXMuby5ub1NlbGVjdFJvb3QpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldEFjdGl2ZShhYm92ZSlcbiAgICAgIH1cbiAgICB9LFxuICAgICdkb3duJzogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMuYWN0aXZlID09PSBudWxsKSB7XG4gICAgICAgIHRoaXMuc2V0QWN0aXZlKHRoaXMucm9vdClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZSA9PT0gJ25ldycpIHJldHVyblxuICAgICAgICBpZiAodGhpcy5hY3RpdmUgPT09IHRoaXMucm9vdCAmJlxuICAgICAgICAgICAgIXRoaXMubW9kZWwuaWRzW3RoaXMucm9vdF0uY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2V0QWN0aXZlKCduZXcnKVxuICAgICAgICB9XG4gICAgICAgIHZhciB0b3AgPSB0aGlzLmFjdGl2ZVxuICAgICAgICAgICwgYWJvdmUgPSB0aGlzLm1vZGVsLmlkQmVsb3codG9wLCB0aGlzLnJvb3QpXG4gICAgICAgIGlmIChhYm92ZSA9PT0gdW5kZWZpbmVkKSBhYm92ZSA9IHRvcFxuICAgICAgICB0aGlzLnNldEFjdGl2ZShhYm92ZSlcbiAgICAgIH1cbiAgICB9LFxuICAgICdsZWZ0JzogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMuYWN0aXZlID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldEFjdGl2ZSh0aGlzLnJvb3QpXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5hY3RpdmUgPT09ICduZXcnKSByZXR1cm4gdGhpcy5zZXRBY3RpdmUodGhpcy5yb290KVxuICAgICAgdmFyIGxlZnQgPSB0aGlzLm1vZGVsLmdldFBhcmVudCh0aGlzLmFjdGl2ZSlcbiAgICAgIGlmICh1bmRlZmluZWQgPT09IGxlZnQpIHJldHVyblxuICAgICAgdGhpcy5zZXRBY3RpdmUobGVmdClcbiAgICB9LFxuICAgICdyaWdodCc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLmFjdGl2ZSA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRBY3RpdmUodGhpcy5yb290KVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuYWN0aXZlID09PSAnbmV3JykgcmV0dXJuXG4gICAgICBpZiAodGhpcy5hY3RpdmUgPT09IHRoaXMucm9vdCAmJlxuICAgICAgICAgICF0aGlzLm1vZGVsLmlkc1t0aGlzLnJvb3RdLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRBY3RpdmUoJ25ldycpXG4gICAgICB9XG4gICAgICB2YXIgcmlnaHQgPSB0aGlzLm1vZGVsLmdldENoaWxkKHRoaXMuYWN0aXZlKVxuICAgICAgaWYgKHRoaXMubW9kZWwuaXNDb2xsYXBzZWQodGhpcy5hY3RpdmUpKSByZXR1cm5cbiAgICAgIGlmICh1bmRlZmluZWQgPT09IHJpZ2h0KSByZXR1cm5cbiAgICAgIHRoaXMuc2V0QWN0aXZlKHJpZ2h0KVxuICAgIH0sXG4gICAgJ25leHQgc2libGluZyc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLmFjdGl2ZSA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRBY3RpdmUodGhpcy5yb290KVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuYWN0aXZlID09PSAnbmV3JykgcmV0dXJuXG4gICAgICB2YXIgc2liID0gdGhpcy5tb2RlbC5uZXh0U2libGluZyh0aGlzLmFjdGl2ZSlcbiAgICAgIGlmICh1bmRlZmluZWQgPT09IHNpYikgcmV0dXJuXG4gICAgICB0aGlzLnNldEFjdGl2ZShzaWIpXG4gICAgfSxcbiAgICAncHJldiBzaWJsaW5nJzogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMuYWN0aXZlID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldEFjdGl2ZSh0aGlzLnJvb3QpXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5hY3RpdmUgPT09ICduZXcnKSByZXR1cm4gdGhpcy5zZXRBY3RpdmUodGhpcy5yb290KVxuICAgICAgdmFyIHNpYiA9IHRoaXMubW9kZWwucHJldlNpYmxpbmcodGhpcy5hY3RpdmUpXG4gICAgICBpZiAodW5kZWZpbmVkID09PSBzaWIpIHJldHVyblxuICAgICAgdGhpcy5zZXRBY3RpdmUoc2liKVxuICAgIH0sXG4gICAgJ21vdmUgdG8gZmlyc3Qgc2libGluZyc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLmFjdGl2ZSA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRBY3RpdmUodGhpcy5yb290KVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuYWN0aXZlID09PSAnbmV3JykgcmV0dXJuXG4gICAgICB0aGlzLmN0cmwuYWN0aW9ucy5tb3ZlVG9Ub3AodGhpcy5hY3RpdmUpXG4gICAgfSxcbiAgICAnbW92ZSB0byBsYXN0IHNpYmxpbmcnOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5hY3RpdmUgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0QWN0aXZlKHRoaXMucm9vdClcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmFjdGl2ZSA9PT0gJ25ldycpIHJldHVyblxuICAgICAgdGhpcy5jdHJsLmFjdGlvbnMubW92ZVRvQm90dG9tKHRoaXMuYWN0aXZlKVxuICAgIH0sXG4gICAgJ25ldyBiZWZvcmUnOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5hY3RpdmUgPT09IG51bGwpIHJldHVyblxuICAgICAgaWYgKHRoaXMuYWN0aXZlID09PSAnbmV3JykgcmV0dXJuIHRoaXMuc3RhcnRFZGl0aW5nKClcbiAgICAgIHRoaXMuY3RybC5hZGRCZWZvcmUodGhpcy5hY3RpdmUpXG4gICAgICB0aGlzLnN0YXJ0RWRpdGluZygpXG4gICAgfSxcbiAgICAnbmV3IGFmdGVyJzogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMuYWN0aXZlID09PSBudWxsKSByZXR1cm5cbiAgICAgIGlmICh0aGlzLmFjdGl2ZSA9PT0gJ25ldycpIHJldHVybiB0aGlzLnN0YXJ0RWRpdGluZygpXG4gICAgICB0aGlzLmN0cmwuYWN0aW9ucy5hZGRBZnRlcih0aGlzLmFjdGl2ZSlcbiAgICAgIHRoaXMuc3RhcnRFZGl0aW5nKClcbiAgICB9LFxuICAgIC8vIG1vdmV6IVxuICAgICd0b2dnbGUgY29sbGFwc2UnOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmN0cmwuYWN0aW9ucy50b2dnbGVDb2xsYXBzZSh0aGlzLmFjdGl2ZSlcbiAgICB9LFxuICAgICdjb2xsYXBzZSc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLmFjdGl2ZSA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRBY3RpdmUodGhpcy5yb290KVxuICAgICAgfVxuICAgICAgdGhpcy5jdHJsLmFjdGlvbnMudG9nZ2xlQ29sbGFwc2UodGhpcy5hY3RpdmUsIHRydWUpXG4gICAgfSxcbiAgICAndW5jb2xsYXBzZSc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLmFjdGl2ZSA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRBY3RpdmUodGhpcy5yb290KVxuICAgICAgfVxuICAgICAgdGhpcy5jdHJsLmFjdGlvbnMudG9nZ2xlQ29sbGFwc2UodGhpcy5hY3RpdmUsIGZhbHNlKVxuICAgIH0sXG4gICAgJ2luZGVudCc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLmFjdGl2ZSA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRBY3RpdmUodGhpcy5yb290KVxuICAgICAgfVxuICAgICAgdGhpcy5jdHJsLmFjdGlvbnMubW92ZVJpZ2h0KHRoaXMuYWN0aXZlKVxuICAgIH0sXG4gICAgJ2RlZGVudCc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLmFjdGl2ZSA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRBY3RpdmUodGhpcy5yb290KVxuICAgICAgfVxuICAgICAgdGhpcy5jdHJsLmFjdGlvbnMubW92ZUxlZnQodGhpcy5hY3RpdmUpXG4gICAgfSxcbiAgICAnbW92ZSBkb3duJzogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMuYWN0aXZlID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldEFjdGl2ZSh0aGlzLnJvb3QpXG4gICAgICB9XG4gICAgICB0aGlzLmN0cmwuYWN0aW9ucy5tb3ZlRG93bih0aGlzLmFjdGl2ZSlcbiAgICB9LFxuICAgICdtb3ZlIHVwJzogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMuYWN0aXZlID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldEFjdGl2ZSh0aGlzLnJvb3QpXG4gICAgICB9XG4gICAgICB0aGlzLmN0cmwuYWN0aW9ucy5tb3ZlVXAodGhpcy5hY3RpdmUpXG4gICAgfVxuICB9LFxuXG4gIHZpc3VhbDoge1xuICAgIC8vIG1vdmVtZW50XG4gICAgJ2ssIHVwJzogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHByZXYgPSB0aGlzLm1vZGVsLnByZXZTaWJsaW5nKHRoaXMuYWN0aXZlLCB0cnVlKVxuICAgICAgaWYgKCFwcmV2KSByZXR1cm5cbiAgICAgIHRoaXMuYWRkVG9TZWxlY3Rpb24ocHJldiwgdHJ1ZSlcbiAgICB9LFxuICAgICdqLCBkb3duJzogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG5leHQgPSB0aGlzLm1vZGVsLm5leHRTaWJsaW5nKHRoaXMuYWN0aXZlLCB0cnVlKVxuICAgICAgaWYgKCFuZXh0KSByZXR1cm5cbiAgICAgIHRoaXMuYWRkVG9TZWxlY3Rpb24obmV4dCwgZmFsc2UpXG4gICAgfSxcbiAgICAnc2hpZnQrZyc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBuID0gdGhpcy5tb2RlbC5pZHNbdGhpcy5zZWxlY3Rpb25bMF1dXG4gICAgICAgICwgY2ggPSB0aGlzLm1vZGVsLmlkc1tuLnBhcmVudF0uY2hpbGRyZW5cbiAgICAgICAgLCBpeCA9IGNoLmluZGV4T2YodGhpcy5zZWxlY3Rpb25bMF0pXG4gICAgICB0aGlzLnNldFNlbGVjdGlvbihjaC5zbGljZShpeCkpXG4gICAgICB0aGlzLnNlbF9pbnZlcnRlZCA9IGZhbHNlXG4gICAgICB0aGlzLnNldEFjdGl2ZShjaFtjaC5sZW5ndGgtMV0pXG4gICAgfSxcbiAgICAnZyBnJzogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG4gPSB0aGlzLm1vZGVsLmlkc1t0aGlzLnNlbGVjdGlvblswXV1cbiAgICAgICAgLCBjaCA9IHRoaXMubW9kZWwuaWRzW24ucGFyZW50XS5jaGlsZHJlblxuICAgICAgICAsIGl4ID0gY2guaW5kZXhPZih0aGlzLnNlbGVjdGlvblswXSlcbiAgICAgICAgLCBpdGVtcyA9IFtdXG4gICAgICBmb3IgKHZhciBpPTA7IGk8PWl4OyBpKyspIHtcbiAgICAgICAgaXRlbXMudW5zaGlmdChjaFtpXSlcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0U2VsZWN0aW9uKGl0ZW1zKVxuICAgICAgdGhpcy5zZWxfaW52ZXJ0ZWQgPSBpdGVtcy5sZW5ndGggPiAxXG4gICAgICB0aGlzLnNldEFjdGl2ZShjaFswXSlcbiAgICB9LFxuICAgICd2LCBzaGlmdCt2LCBlc2NhcGUnOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnN0b3BTZWxlY3RpbmcoKVxuICAgIH0sXG4gICAgJ2ksIGEsIHNoaWZ0K2EnOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnN0YXJ0RWRpdGluZyh0aGlzLmFjdGl2ZSlcbiAgICB9LFxuICAgICdzaGlmdCtpJzogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5zdGFydEVkaXRpbmcodGhpcy5hY3RpdmUsIHRydWUpXG4gICAgfSxcblxuICAgIC8vIGVkaXRuZXNzXG4gICAgJ2QsIHNoaWZ0K2QsIGN0cmwreCc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBpdGVtcyA9IHRoaXMuc2VsZWN0aW9uLnNsaWNlKClcbiAgICAgIGlmICh0aGlzLnNlbF9pbnZlcnRlZCkge1xuICAgICAgICBpdGVtcyA9IHJldmVyc2VkKGl0ZW1zKVxuICAgICAgfVxuICAgICAgdGhpcy5jdHJsLmFjdGlvbnMuY3V0KGl0ZW1zKVxuICAgICAgdGhpcy5zdG9wU2VsZWN0aW5nKClcbiAgICB9LFxuICAgICd5LCBzaGlmdCt5LCBjdHJsK2MnOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgaXRlbXMgPSB0aGlzLnNlbGVjdGlvbi5zbGljZSgpXG4gICAgICBpZiAodGhpcy5zZWxfaW52ZXJ0ZWQpIHtcbiAgICAgICAgaXRlbXMgPSByZXZlcnNlZChpdGVtcylcbiAgICAgIH1cbiAgICAgIHRoaXMuY3RybC5hY3Rpb25zLmNvcHkoaXRlbXMpXG4gICAgICB0aGlzLnN0b3BTZWxlY3RpbmcoKVxuICAgIH0sXG4gICAgJ3UsIGN0cmwreic6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuc3RvcFNlbGVjdGluZygpXG4gICAgICB0aGlzLmN0cmwudW5kbygpXG4gICAgfSxcbiAgICAnc2hpZnQrciwgY3RybCtzaGlmdCt6JzogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5zdG9wU2VsZWN0aW5nKClcbiAgICAgIHRoaXMuY3RybC5yZWRvKClcbiAgICB9LFxuICB9LFxuXG4gIGV4dHJhX2FjdGlvbnM6IHt9LFxuXG4gIGtleUhhbmRsZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbm9ybWFsID0ge31cbiAgICAgICwgbmFtZVxuICAgIGZvciAobmFtZSBpbiB0aGlzLm8ua2V5YmluZGluZ3MpIHtcbiAgICAgIGlmICghdGhpcy5hY3Rpb25zW25hbWVdKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb25maWd1cmF0aW9uISBVbmtub3duIGFjdGlvbjogJyArIG5hbWUpXG4gICAgICB9XG4gICAgICBub3JtYWxbdGhpcy5vLmtleWJpbmRpbmdzW25hbWVdXSA9IHRoaXMuYWN0aW9uc1tuYW1lXVxuICAgIH1cblxuICAgIGlmICh0aGlzLmV4dHJhX2FjdGlvbnMpIHtcbiAgICAgIGZvciAobmFtZSBpbiB0aGlzLmV4dHJhX2FjdGlvbnMpIHtcbiAgICAgICAgaWYgKCFub3JtYWxbbmFtZV0pIHtcbiAgICAgICAgICBub3JtYWxbdGhpcy5leHRyYV9hY3Rpb25zW25hbWVdLmJpbmRpbmddID0gdGhpcy5leHRyYV9hY3Rpb25zW25hbWVdLmFjdGlvblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGhhbmRsZXJzID0ge1xuICAgICAgJ2luc2VydCc6IGZ1bmN0aW9uICgpIHt9LFxuICAgICAgJ25vcm1hbCc6IGtleXMobm9ybWFsKSxcbiAgICAgICd2aXN1YWwnOiBrZXlzKHRoaXMudmlzdWFsKVxuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gaGFuZGxlcnNbdGhpcy5tb2RlXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgfS5iaW5kKHRoaXMpXG4gIH0sXG5cbiAgYXR0YWNoTGlzdGVuZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGtleWRvd24gPSB0aGlzLmtleUhhbmRsZXIoKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGlmICh0aGlzLm1vZGUgPT09ICdpbnNlcnQnKSByZXR1cm5cbiAgICAgIGtleWRvd24uY2FsbCh0aGlzLCBlKVxuICAgIH0uYmluZCh0aGlzKSlcbiAgfSxcblxuICBhZGRUcmVlOiBmdW5jdGlvbiAobm9kZSwgYmVmb3JlKSB7XG4gICAgaWYgKCF0aGlzLnZsLmJvZHkobm9kZS5wYXJlbnQpKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWJhc2Uobm9kZS5wYXJlbnQsIHRydWUpXG4gICAgfVxuICAgIHRoaXMuYWRkKG5vZGUsIGJlZm9yZSlcbiAgICBpZiAoIW5vZGUuY2hpbGRyZW4ubGVuZ3RoKSByZXR1cm5cbiAgICBmb3IgKHZhciBpPTA7IGk8bm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5hZGRUcmVlKHRoaXMubW9kZWwuaWRzW25vZGUuY2hpbGRyZW5baV1dLCBmYWxzZSlcbiAgICB9XG4gIH0sXG5cbiAgLy8gb3BlcmF0aW9uc1xuICBhZGQ6IGZ1bmN0aW9uIChub2RlLCBiZWZvcmUsIGRvbnRmb2N1cykge1xuICAgIHZhciBlZCA9IHRoaXMubW9kZSA9PT0gJ2luc2VydCdcbiAgICAgICwgY2hpbGRyZW4gPSAhIW5vZGUuY2hpbGRyZW4ubGVuZ3RoXG4gICAgaWYgKCF0aGlzLnZsLmJvZHkobm9kZS5wYXJlbnQpKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWJhc2Uobm9kZS5wYXJlbnQsIHRydWUpXG4gICAgfVxuICAgIHRoaXMudmwuYWRkTmV3KG5vZGUsIHRoaXMuYmluZEFjdGlvbnMobm9kZS5pZCksIGJlZm9yZSwgY2hpbGRyZW4pXG4gICAgaWYgKCFkb250Zm9jdXMpIHtcbiAgICAgIGlmIChlZCkge1xuICAgICAgICB0aGlzLnZsLmJvZHkobm9kZS5pZCkuc3RhcnRFZGl0aW5nKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0QWN0aXZlKG5vZGUuaWQpXG4gICAgICB9XG4gICAgfVxuICB9LFxuICByZW1vdmU6IGZ1bmN0aW9uIChpZCkge1xuICAgIHZhciBwaWQgPSB0aGlzLm1vZGVsLmlkc1tpZF0ucGFyZW50XG4gICAgICAsIHBhcmVudCA9IHRoaXMubW9kZWwuaWRzW3BpZF1cbiAgICBpZiAoIXRoaXMudmwuYm9keShpZCkpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYmFzZShwaWQsIHRydWUpXG4gICAgfVxuICAgIGlmIChpZCA9PT0gdGhpcy5hY3RpdmUpIHtcbiAgICAgIHRoaXMuc2V0QWN0aXZlKHRoaXMucm9vdClcbiAgICB9XG4gICAgdGhpcy52bC5yZW1vdmUoaWQsIHBpZCwgcGFyZW50ICYmIHBhcmVudC5jaGlsZHJlbi5sZW5ndGggPT09IDEpXG4gICAgaWYgKHBhcmVudC5jaGlsZHJlbi5sZW5ndGggPT09IDEgJiYgcGlkID09PSB0aGlzLnJvb3QpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5hZGROZXcocGlkLCAwKVxuICAgICAgfS5iaW5kKHRoaXMpLDApXG4gICAgfVxuICB9LFxuICBzZXRBdHRyOiBmdW5jdGlvbiAoaWQsIGF0dHIsIHZhbHVlKSB7XG4gICAgaWYgKCF0aGlzLnZsLmJvZHkoaWQpKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWJhc2UoaWQsIHRydWUpXG4gICAgfVxuICAgIHRoaXMudmwuYm9keShpZCkuc2V0QXR0cihhdHRyLCB2YWx1ZSlcbiAgICBpZiAodGhpcy5tb2RlID09PSAnaW5zZXJ0Jykge1xuICAgICAgdGhpcy52bC5ib2R5KGlkKS5zdGFydEVkaXRpbmcoKVxuICAgIH1cbiAgfSxcbiAgc2V0RGF0YTogZnVuY3Rpb24gKGlkLCBkYXRhKSB7XG4gICAgdGhpcy52bC5ib2R5KGlkKS5zZXREYXRhKGRhdGEpXG4gICAgaWYgKHRoaXMubW9kZSA9PT0gJ2luc2VydCcpIHtcbiAgICAgIHRoaXMudmwuYm9keShpZCkuc3RhcnRFZGl0aW5nKClcbiAgICB9XG4gIH0sXG4gIGFwcGVuZFRleHQ6IGZ1bmN0aW9uIChpZCwgdGV4dCkge1xuICAgIHRoaXMudmwuYm9keShpZCkuYWRkRWRpdFRleHQodGV4dClcbiAgfSxcbiAgbW92ZTogZnVuY3Rpb24gKGlkLCBwaWQsIGJlZm9yZSwgcHBpZCwgbGFzdGNoaWxkKSB7XG4gICAgaWYgKCF0aGlzLnZsLmJvZHkoaWQpKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWJhc2UodGhpcy5tb2RlbC5jb21tb25QYXJlbnQocGlkLCBwcGlkKSwgdHJ1ZSlcbiAgICB9XG4gICAgdmFyIGVkID0gdGhpcy5tb2RlID09PSAnaW5zZXJ0J1xuICAgIHRoaXMudmwubW92ZShpZCwgcGlkLCBiZWZvcmUsIHBwaWQsIGxhc3RjaGlsZClcbiAgICBpZiAoZWQpIHRoaXMuc3RhcnRFZGl0aW5nKGlkKVxuICB9LFxuICBzdGFydEVkaXRpbmc6IGZ1bmN0aW9uIChpZCwgZnJvbVN0YXJ0KSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGlkID0gdGhpcy5hY3RpdmUgIT09IG51bGwgPyB0aGlzLmFjdGl2ZSA6IHRoaXMucm9vdFxuICAgIH1cbiAgICBpZiAoaWQgPT09IHRoaXMucm9vdCAmJiB0aGlzLm8ubm9TZWxlY3RSb290KSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdmFyIGJvZHkgPSB0aGlzLnZsLmJvZHkoaWQpXG4gICAgaWYgKCFib2R5KSByZXR1cm5cbiAgICBib2R5LnN0YXJ0RWRpdGluZyhmcm9tU3RhcnQpXG4gIH0sXG4gIHNldEVkaXRpbmc6IGZ1bmN0aW9uIChpZCkge1xuICAgIGlmICh0aGlzLm1vZGUgPT09ICd2aXN1YWwnKSB7XG4gICAgICB0aGlzLnN0b3BTZWxlY3RpbmcoKVxuICAgIH1cbiAgICB0aGlzLm1vZGUgPSAnaW5zZXJ0J1xuICAgIHRoaXMuc2V0QWN0aXZlKGlkKVxuICB9LFxuICBkb25lRWRpdGluZzogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubW9kZSA9ICdub3JtYWwnXG4gIH0sXG4gIHNldEFjdGl2ZTogZnVuY3Rpb24gKGlkKSB7XG4gICAgaWYgKGlkID09PSB0aGlzLmFjdGl2ZSkgcmV0dXJuXG4gICAgaWYgKHRoaXMuYWN0aXZlICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnZsLmNsZWFyQWN0aXZlKHRoaXMuYWN0aXZlKVxuICAgIH1cbiAgICBpZiAoIXRoaXMudmwuZG9tW2lkXSkge1xuICAgICAgaWQgPSB0aGlzLnJvb3RcbiAgICB9XG4gICAgdGhpcy5hY3RpdmUgPSBpZFxuICAgIHRoaXMudmwuc2hvd0FjdGl2ZShpZClcbiAgfSxcbiAgZ2V0QWN0aXZlOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLnZsLmRvbVt0aGlzLmFjdGl2ZV0pIHtcbiAgICAgIHJldHVybiB0aGlzLnJvb3RcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlXG4gIH0sXG4gIGFkZFRvU2VsZWN0aW9uOiBmdW5jdGlvbiAoaWQsIGludmVydCkge1xuICAgIHZhciBpeCA9IHRoaXMuc2VsZWN0aW9uLmluZGV4T2YoaWQpXG4gICAgaWYgKGl4ID09PSAtMSkge1xuICAgICAgdGhpcy5zZWxlY3Rpb24ucHVzaChpZClcbiAgICAgIHRoaXMudmwuc2hvd1NlbGVjdGlvbihbaWRdKVxuICAgICAgdGhpcy5zZWxfaW52ZXJ0ZWQgPSBpbnZlcnRcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52bC5jbGVhclNlbGVjdGlvbih0aGlzLnNlbGVjdGlvbi5zbGljZShpeCArIDEpKVxuICAgICAgdGhpcy5zZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvbi5zbGljZSgwLCBpeCArIDEpXG4gICAgICBpZiAodGhpcy5zZWxlY3Rpb24ubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHRoaXMuc2VsX2ludmVydGVkID0gZmFsc2VcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5zZXRBY3RpdmUoaWQpXG4gICAgY29uc29sZS5sb2codGhpcy5zZWxfaW52ZXJ0ZWQpXG4gIH0sXG4gIHNldFNlbGVjdGlvbjogZnVuY3Rpb24gKHNlbCkge1xuICAgIHRoaXMubW9kZSA9ICd2aXN1YWwnXG4gICAgdGhpcy5zZWxfaW52ZXJ0ZWQgPSBmYWxzZVxuICAgIGlmICh0aGlzLnNlbGVjdGlvbikge1xuICAgICAgdGhpcy52bC5jbGVhclNlbGVjdGlvbih0aGlzLnNlbGVjdGlvbilcbiAgICB9XG4gICAgdGhpcy5zZWxlY3Rpb24gPSBzZWxcbiAgICB0aGlzLnZsLnNob3dTZWxlY3Rpb24oc2VsKVxuICB9LFxuICBzdG9wU2VsZWN0aW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnZsLmNsZWFyU2VsZWN0aW9uKHRoaXMuc2VsZWN0aW9uKVxuICAgICAgdGhpcy5zZWxlY3Rpb24gPSBudWxsXG4gICAgfVxuICAgIHRoaXMubW9kZSA9ICdub3JtYWwnXG4gIH0sXG4gIHNldENvbGxhcHNlZDogZnVuY3Rpb24gKGlkLCB3aGF0KSB7XG4gICAgLypcbiAgICBpZiAoIXRoaXMudmwuYm9keShpZCkpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYmFzZSh0aGlzLm1vZGVsLmlkc1tpZF0ucGFyZW50KVxuICAgIH1cbiAgICAqL1xuICAgIHRoaXMudmwuc2V0Q29sbGFwc2VkKGlkLCB3aGF0KVxuICAgIGlmICh3aGF0KSB7XG4gICAgICBpZiAodGhpcy5tb2RlID09PSAnaW5zZXJ0Jykge1xuICAgICAgICB0aGlzLnN0YXJ0RWRpdGluZyhpZClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0QWN0aXZlKGlkKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5sYXp5X2NoaWxkcmVuW2lkXSkge1xuICAgICAgICB0aGlzLnBvcHVsYXRlQ2hpbGRyZW4oaWQpXG4gICAgICB9XG4gICAgfVxuICAgIC8vIFRPRE86IGV2ZW50IGxpc3RlbmVycz9cbiAgfSxcblxuICAvLyBub24tbW9kaWZ5aW5nIHN0dWZmXG4gIGdvVXA6IGZ1bmN0aW9uIChpZCkge1xuICAgIC8vIHNob3VsZCBJIGNoZWNrIHRvIHNlZSBpZiBpdCdzIG9rP1xuICAgIHZhciBhYm92ZSA9IHRoaXMubW9kZWwuaWRBYm92ZShpZClcbiAgICBpZiAoYWJvdmUgPT09IGZhbHNlKSByZXR1cm5cbiAgICBpZiAoYWJvdmUgPT09IHRoaXMucm9vdCAmJiB0aGlzLm8ubm9TZWxlY3RSb290KSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy52bC5ib2R5KGFib3ZlKS5ib2R5LnN0YXJ0RWRpdGluZygpO1xuICB9LFxuICBnb0Rvd246IGZ1bmN0aW9uIChpZCwgZnJvbVN0YXJ0KSB7XG4gICAgdmFyIGJlbG93ID0gdGhpcy5tb2RlbC5pZEJlbG93KGlkLCB0aGlzLnJvb3QpXG4gICAgaWYgKGJlbG93ID09PSBmYWxzZSkgcmV0dXJuXG4gICAgdGhpcy52bC5ib2R5KGJlbG93KS5ib2R5LnN0YXJ0RWRpdGluZyhmcm9tU3RhcnQpXG4gIH0sXG59XG5cbiIsIlxudmFyIENvbnRyb2xsZXIgPSByZXF1aXJlKCcuLi8uLi9saWIvY29udHJvbGxlcicpXG4gICwgdXRpbCA9IHJlcXVpcmUoJy4uLy4uL2xpYi91dGlsJylcblxuICAsIFdGTm9kZSA9IHJlcXVpcmUoJy4vbm9kZScpXG4gICwgV0ZWaWV3ID0gcmVxdWlyZSgnLi92aWV3JylcbiAgLCBXRlZMID0gcmVxdWlyZSgnLi92bCcpXG5cbm1vZHVsZS5leHBvcnRzID0gV0ZDb250cm9sbGVyXG5cbmZ1bmN0aW9uIFdGQ29udHJvbGxlcihtb2RlbCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gdXRpbC5tZXJnZSh7XG4gICAgVmlldzogV0ZWaWV3LFxuICAgIHZpZXdPcHRpb25zOiB7XG4gICAgICBWaWV3TGF5ZXI6IFdGVkwsXG4gICAgICBub2RlOiBXRk5vZGVcbiAgICB9LFxuICB9LCBvcHRpb25zKVxuICBDb250cm9sbGVyLmNhbGwodGhpcywgbW9kZWwsIG9wdGlvbnMpXG4gIHRoaXMub24oJ3JlYmFzZScsIGZ1bmN0aW9uIChpZCkge1xuICAgICAgdGhpcy50cmlnZ2VyKCdidWxsZXQnLCB0aGlzLm1vZGVsLmdldExpbmVhZ2UoaWQpKVxuICB9LmJpbmQodGhpcykpXG59XG5cbldGQ29udHJvbGxlci5wcm90b3R5cGUgPSB1dGlsLmV4dGVuZChPYmplY3QuY3JlYXRlKENvbnRyb2xsZXIucHJvdG90eXBlKSwge1xuICByZWZyZXNoQnVsbGV0OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy50cmlnZ2VyKCdidWxsZXQnLCB0aGlzLm1vZGVsLmdldExpbmVhZ2UodGhpcy5tb2RlbC5yb290KSlcbiAgfVxufSlcblxuV0ZDb250cm9sbGVyLnByb3RvdHlwZS5hY3Rpb25zID0gdXRpbC5leHRlbmQoe1xuICBjbGlja0J1bGxldDogZnVuY3Rpb24gKGlkKSB7XG4gICAgaWYgKGlkID09PSAnbmV3JykgcmV0dXJuXG4gICAgdGhpcy52aWV3LnJlYmFzZShpZClcbiAgICB0aGlzLnRyaWdnZXIoJ2J1bGxldCcsIHRoaXMubW9kZWwuZ2V0TGluZWFnZShpZCkpXG4gIH0sXG4gIGJhY2tBTGV2ZWw6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcm9vdCA9IHRoaXMudmlldy5yb290XG4gICAgICAsIHBpZCA9IHRoaXMubW9kZWwuaWRzW3Jvb3RdLnBhcmVudFxuICAgIGlmICghdGhpcy5tb2RlbC5pZHNbcGlkXSkgcmV0dXJuXG4gICAgdGhpcy5hY3Rpb25zLmNsaWNrQnVsbGV0KHBpZClcbiAgfVxufSwgQ29udHJvbGxlci5wcm90b3R5cGUuYWN0aW9ucylcblxuIiwiXG4vKioganNoaW50OiBtYXJrZWQ6IGZhbHNlICovXG52YXIgZCA9IFJlYWN0LkRPTVxuXG52YXIgSGlzdG9yeSA9IG1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ0hpc3RvcnknLFxuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaXRlbXM6IFtdLFxuICAgICAgb25DbGljazogZnVuY3Rpb24gKCkge31cbiAgICB9XG4gIH0sXG4gIG1vdXNlRG93bjogZnVuY3Rpb24gKGlkLCBlKSB7XG4gICAgaWYgKGUuYnV0dG9uICE9PSAwKSByZXR1cm5cbiAgICB0aGlzLnByb3BzLm9uQ2xpY2soaWQpXG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgIHJldHVybiBkLnVsKFxuICAgICAge2NsYXNzTmFtZTogJ2JyZWFkY3J1bWInfSxcbiAgICAgIHRoaXMucHJvcHMuaXRlbXMuc2xpY2UoMCwgLTEpLm1hcChmdW5jdGlvbiAoaXRlbSwgaSkge1xuICAgICAgICByZXR1cm4gZC5saSh7XG4gICAgICAgICAga2V5OiBpdGVtLmlkLFxuICAgICAgICAgIGNsYXNzTmFtZTogJ3RyZWVkX19icmVhZCcsXG4gICAgICAgICAgb25Nb3VzZURvd246IHRoYXQubW91c2VEb3duLmJpbmQobnVsbCwgaXRlbS5pZCksXG4gICAgICAgICAgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw6IHtcbiAgICAgICAgICAgIF9faHRtbDogbWFya2VkKGl0ZW0ubmFtZSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIClcbiAgfVxufSlcblxuIiwiXG52YXIgTW9kZWwgPSByZXF1aXJlKCcuLi8uLi9saWIvbW9kZWwnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFdGTW9kZWxcblxuZnVuY3Rpb24gV0ZNb2RlbCgpIHtcbiAgTW9kZWwuYXBwbHkodGhpcywgYXJndW1lbnRzKVxufVxuXG5XRk1vZGVsLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoTW9kZWwucHJvdG90eXBlKVxuXG5XRk1vZGVsLnByb3RvdHlwZS5nZXRMaW5lYWdlID0gZnVuY3Rpb24gKGlkKSB7XG4gIHZhciBsaW5lYWdlID0gW11cbiAgd2hpbGUgKHRoaXMuaWRzW2lkXSkge1xuICAgIGxpbmVhZ2UudW5zaGlmdCh7XG4gICAgICBuYW1lOiB0aGlzLmlkc1tpZF0uZGF0YS5uYW1lLFxuICAgICAgaWQ6IGlkXG4gICAgfSlcbiAgICBpZCA9IHRoaXMuaWRzW2lkXS5wYXJlbnRcbiAgfVxuICByZXR1cm4gbGluZWFnZVxufVxuXG5cbiIsIlxudmFyIERlZmF1bHROb2RlID0gcmVxdWlyZSgnLi4vLi4vbGliL2RlZmF1bHQtbm9kZScpXG5cbm1vZHVsZS5leHBvcnRzID0gV0ZOb2RlXG5cbmZ1bmN0aW9uIFdGTm9kZShkYXRhLCBvcHRpb25zLCBpc05ldykge1xuICBEZWZhdWx0Tm9kZS5jYWxsKHRoaXMsIGRhdGEsIG9wdGlvbnMsIGlzTmV3KVxufVxuXG5XRk5vZGUucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShEZWZhdWx0Tm9kZS5wcm90b3R5cGUpXG5XRk5vZGUucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gV0ZOb2RlXG5cbldGTm9kZS5wcm90b3R5cGUuc2V0QXR0ciA9IGZ1bmN0aW9uIChhdHRyLCB2YWx1ZSkge1xuICBpZiAoYXR0ciAhPT0gJ2RvbmUnKSB7XG4gICAgRGVmYXVsdE5vZGUucHJvdG90eXBlLnNldEF0dHIuY2FsbCh0aGlzLCBhdHRyLCB2YWx1ZSlcbiAgICByZXR1cm5cbiAgfVxuICB0aGlzLmRvbmUgPSB2YWx1ZVxuICBpZiAodmFsdWUpIHtcbiAgICB0aGlzLm5vZGUuY2xhc3NMaXN0LmFkZCgnbGlzdGxlc3NfX2RlZmF1bHQtbm9kZS0tZG9uZScpXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5ub2RlLmNsYXNzTGlzdC5yZW1vdmUoJ2xpc3RsZXNzX19kZWZhdWx0LW5vZGUtLWRvbmUnKVxuICB9XG59XG5cbldGTm9kZS5wcm90b3R5cGUuZXh0cmFfYWN0aW9ucyA9IHtcbiAgJ3JlYmFzZSc6IHtcbiAgICBiaW5kaW5nOiAnYWx0K3JldHVybicsXG4gICAgYWN0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLm8uY2xpY2tCdWxsZXQoKVxuICAgIH1cbiAgfSxcbiAgJ2JhY2sgYSBsZXZlbCc6IHtcbiAgICBiaW5kaW5nOiAnc2hpZnQrYWx0K3JldHVybicsXG4gICAgYWN0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLm8uYmFja0FMZXZlbCgpXG4gICAgfVxuICB9LFxuICAndG9nZ2xlIGRvbmUnOiB7XG4gICAgYmluZGluZzogJ2N0cmwrcmV0dXJuJyxcbiAgICBhY3Rpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuYmx1cigpXG4gICAgICB0aGlzLm8uY2hhbmdlZCgnZG9uZScsICF0aGlzLmRvbmUpXG4gICAgICB0aGlzLmZvY3VzKClcbiAgICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgICAgdGhpcy5vLmdvRG93bigpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbiIsIlxudmFyIFZpZXcgPSByZXF1aXJlKCcuLi8uLi9saWIvdmlldycpXG5cbm1vZHVsZS5leHBvcnRzID0gV0ZWaWV3XG5cbmZ1bmN0aW9uIFdGVmlldygpIHtcbiAgVmlldy5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG59XG5cbldGVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKVxuXG5XRlZpZXcucHJvdG90eXBlLmV4dHJhX2FjdGlvbnMgPSB7XG4gICdyZWJhc2UnOiB7XG4gICAgYmluZGluZzogJ2FsdCtyZXR1cm4nLFxuICAgIGFjdGlvbjogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5jdHJsLmFjdGlvbnMuY2xpY2tCdWxsZXQodGhpcy5hY3RpdmUpXG4gICAgfVxuICB9LFxuICAnYmFjayBhIGxldmVsJzoge1xuICAgIGJpbmRpbmc6ICdzaGlmdCthbHQrcmV0dXJuJyxcbiAgICBhY3Rpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuY3RybC5hY3Rpb25zLmJhY2tBTGV2ZWwoKVxuICAgIH1cbiAgfSxcbiAgJ3RvZ2dsZSBkb25lJzoge1xuICAgIGJpbmRpbmc6ICdjdHJsK3JldHVybicsXG4gICAgYWN0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5hY3RpdmUgPT09IG51bGwpIHJldHVyblxuICAgICAgdmFyIGlkID0gdGhpcy5hY3RpdmVcbiAgICAgICAgLCBkb25lID0gIXRoaXMubW9kZWwuaWRzW2lkXS5kYXRhLmRvbmVcbiAgICAgICAgLCBuZXh0ID0gdGhpcy5tb2RlbC5pZEJlbG93KGlkLCB0aGlzLnJvb3QpXG4gICAgICBpZiAobmV4dCA9PT0gdW5kZWZpbmVkKSBuZXh0ID0gaWRcbiAgICAgIHRoaXMuY3RybC5hY3Rpb25zLmNoYW5nZWQodGhpcy5hY3RpdmUsICdkb25lJywgZG9uZSlcbiAgICAgIGlmIChkb25lKSB7XG4gICAgICAgIHRoaXMuZ29UbyhuZXh0KVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4iLCJcbnZhciBEb21WaWV3TGF5ZXIgPSByZXF1aXJlKCcuLi8uLi9saWIvZG9tLXZsJylcblxubW9kdWxlLmV4cG9ydHMgPSBXRlZMXG5cbmZ1bmN0aW9uIFdGVkwoKSB7XG4gIERvbVZpZXdMYXllci5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG59XG5cbldGVkwucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShEb21WaWV3TGF5ZXIucHJvdG90eXBlKVxuXG5XRlZMLnByb3RvdHlwZS5tYWtlSGVhZCA9IGZ1bmN0aW9uIChib2R5LCBhY3Rpb25zKSB7XG4gIHZhciBoZWFkID0gRG9tVmlld0xheWVyLnByb3RvdHlwZS5tYWtlSGVhZC5jYWxsKHRoaXMsIGJvZHksIGFjdGlvbnMpXG4gICAgLCBidWxsZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICBidWxsZXQuY2xhc3NMaXN0LmFkZCgndHJlZWRfX2J1bGxldCcpXG4gIGJ1bGxldC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBhY3Rpb25zLmNsaWNrQnVsbGV0KVxuICBoZWFkLmluc2VydEJlZm9yZShidWxsZXQsIGhlYWQuY2hpbGROb2Rlc1sxXSlcbiAgcmV0dXJuIGhlYWRcbn1cblxuIiwiXG52YXIgZCA9IFJlYWN0LkRPTVxuXG52YXIgV3JhcHBlciA9IG1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBwcm9wVHlwZXM6IHtcbiAgICBjb250cm9sbGVyOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICAgIG9uQnVsbGV0OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICBvbkJyZWFkQ3J1bWI6IFJlYWN0LlByb3BUeXBlcy5mdW5jXG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuX2luaXQodGhpcy5wcm9wcyk7XG4gICAgfS5iaW5kKHRoaXMpLCAwKVxuICB9LFxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbiAobmV4dFByb3BzKSB7XG4gICAgaWYgKG5leHRQcm9wcy5jb250cm9sbGVyID09PSB0aGlzLnByb3BzLmNvbnRyb2xsZXIpIHJldHVyblxuXG4gICAgdGhpcy5fZGVzdHJveSgpXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLl9pbml0KG5leHRQcm9wcylcbiAgICB9LmJpbmQodGhpcyksIDApXG4gIH0sXG5cbiAgX2luaXQ6IGZ1bmN0aW9uIChwcm9wcykge1xuICAgIHRoaXMuZ2V0RE9NTm9kZSgpLmFwcGVuZENoaWxkKHByb3BzLmNvbnRyb2xsZXIubm9kZSlcbiAgfSxcbiAgX2Rlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMucHJvcHMuY29udHJvbGxlcikgcmV0dXJuXG4gICAgdGhpcy5wcm9wcy5jb250cm9sbGVyLm5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLnByb3BzLmNvbnRyb2xsZXIubm9kZSlcbiAgICBkZWxldGUgdGhpcy5jdHJsXG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGQuZGl2KClcbiAgfVxufSlcblxuIl19
