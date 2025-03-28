import React from 'react';

function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : String(i);
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}

const _excluded = ["component"];
const NODE_HEADING = 'heading';
const NODE_CODEBLOCK = 'code_block';
const NODE_PARAGRAPH = 'paragraph';
const NODE_QUOTE = 'blockquote';
const NODE_OL = 'ordered_list';
const NODE_UL = 'bullet_list';
const NODE_LI = 'list_item';
const NODE_HR = 'horizontal_rule';
const NODE_BR = 'hard_break';
const NODE_IMAGE = 'image';
const NODE_EMOJI = 'emoji';
const NODE_TABLE = 'table';
const NODE_TABLE_ROW = 'table_row';
const NODE_TABLE_CELL = 'table_cell';
const NODE_TABLE_HEADER = 'table_header';
const MARK_BOLD = 'bold';
const MARK_ITALIC = 'italic';
const MARK_STRIKE = 'strike';
const MARK_UNDERLINE = 'underline';
const MARK_CODE = 'code';
const MARK_LINK = 'link';
const MARK_STYLED = 'styled';
const MARK_SUBSCRIPT = 'subscript';
const MARK_SUPERSCRIPT = 'superscript';
const MARK_HIGHLIGHT = 'highlight';
const MARK_TEXT_STYLE = 'textStyle';
const MARK_ANCHOR = 'anchor';
function render(document, options = {}) {
  if (typeof document === 'object' && document.type === 'doc' && Array.isArray(document.content)) {
    const _options$blokResolver = options.blokResolvers,
      blokResolvers = _options$blokResolver === void 0 ? {} : _options$blokResolver,
      _options$defaultBlokR = options.defaultBlokResolver,
      defaultBlokResolver = _options$defaultBlokR === void 0 ? function () {
        return null;
      } : _options$defaultBlokR,
      _options$nodeResolver = options.nodeResolvers,
      customNodeResolvers = _options$nodeResolver === void 0 ? {} : _options$nodeResolver,
      _options$markResolver = options.markResolvers,
      customMarkResolvers = _options$markResolver === void 0 ? {} : _options$markResolver,
      _options$textResolver = options.textResolver,
      textResolver = _options$textResolver === void 0 ? function (str) {
        return str;
      } : _options$textResolver;
    const nodeResolvers = _objectSpread2(_objectSpread2({}, defaultNodeResolvers), customNodeResolvers);
    const markResolvers = _objectSpread2(_objectSpread2({}, defaultMarkResolvers), customMarkResolvers);
    let currentKey = 0;
    const addKey = function (element) {
      return React.isValidElement(element) ? React.cloneElement(element, {
        key: currentKey++
      }) : element;
    };
    const renderNodes = function (nodes) {
      const elements = nodes ? nodes.map(renderNode).filter(function (node) {
        return node != null;
      }) : null;
      return Array.isArray(elements) && elements.length === 0 ? null : elements;
    };
    const renderNode = function (node) {
      if (node.type === 'blok') {
        const body = node.attrs.body;
        return body.map(function (_ref) {
          let component = _ref.component,
            props = _objectWithoutProperties(_ref, _excluded);
          const resolver = blokResolvers[component];
          const element = resolver ? resolver(props) : defaultBlokResolver(component, props);
          return addKey(element);
        });
      } else {
        var _node$marks;
        let childNode;
        if (node.type === 'text') {
          childNode = textResolver(node.text);
        } else {
          const resolver = nodeResolvers[node.type];
          childNode = resolver ? addKey(resolver(renderNodes(node.content), node.attrs)) : null;
        }
        const marks = (_node$marks = node.marks) !== null && _node$marks !== void 0 ? _node$marks : [];
        return marks.reduceRight(function (children, mark) {
          const resolver = markResolvers[mark.type];
          return resolver ? addKey(resolver(children, mark.attrs)) : children;
        }, childNode);
      }
    };
    return renderNodes(document.content);
  } else if (typeof document === 'string') {
    const _options$defaultStrin = options.defaultStringResolver,
      defaultStringResolver = _options$defaultStrin === void 0 ? function (str) {
        return str;
      } : _options$defaultStrin,
      _options$textResolver2 = options.textResolver,
      textResolver = _options$textResolver2 === void 0 ? function (str) {
        return str;
      } : _options$textResolver2;
    return defaultStringResolver(textResolver(document));
  }
  return null;
}
const simpleNodeResolver = function (element) {
  return function (children) {
    return children != null ? React.createElement(element, null, children) : null;
  };
};
const emptyNodeResolver = function (element) {
  return function () {
    return React.createElement(element);
  };
};
const headingNodeResolver = function (children, props) {
  return React.createElement(`h${props.level}`, null, children);
};
const imageNodeResolver = function (children, props) {
  return React.createElement('img', props, children);
};
const codeblockNodeResolver = function (children, props) {
  const codeProps = {
    className: props.class
  };
  const code = React.createElement('code', codeProps, children);
  return React.createElement('pre', null, code);
};
const emojiNodeResolver = function (_, attrs) {
  if (!attrs) return null;
  const props = {
    'data-type': 'emoji',
    'data-name': attrs.name,
    emoji: attrs.emoji
  };
  if (attrs.emoji || !attrs.fallbackImage) {
    return React.createElement('span', props, attrs.emoji);
  } else {
    const fallbackProps = {
      src: attrs.fallbackImage,
      draggable: 'false',
      loading: 'lazy',
      align: 'absmiddle',
      alt: attrs.name
    };
    const fallback = React.createElement('img', fallbackProps);
    return React.createElement('span', props, fallback);
  }
};
const simpleMarkResolver = function (element) {
  return function (children) {
    return React.createElement(element, null, children);
  };
};
const linkMarkResolver = function (children, attrs) {
  const props = attrs ? {
    href: attrs.linktype === 'email' ? `mailto:${attrs.href}` : attrs.href,
    target: attrs.target
  } : {};
  return React.createElement('a', props, children);
};
const styledMarkResolver = function (children, attrs) {
  const props = attrs ? {
    className: attrs.class
  } : {};
  return React.createElement('span', props, children);
};
const highlightMarkResolver = function (children, attrs) {
  const props = attrs ? {
    style: {
      backgroundColor: attrs.color
    }
  } : {};
  return React.createElement('span', props, children);
};
const textStyleMarkResolver = function (children, attrs) {
  const props = attrs?.color ? {
    style: {
      color: attrs.color
    }
  } : {};
  return React.createElement('span', props, children);
};
const anchorMarkResolver = function (children, attrs) {
  const props = attrs ? {
    id: attrs.id
  } : {};
  return React.createElement('span', props, children);
};
const tableNodeResolver = function (children, attrs) {
  const props = attrs ? {
    className: attrs.class
  } : {};
  return React.createElement('table', props, children);
};
const tableRowNodeResolver = function (children, attrs) {
  const props = attrs ? {
    className: attrs.class
  } : {};
  return React.createElement('tr', props, children);
};
const tableCellNodeResolver = function (children, attrs) {
  const props = attrs ? {
    className: attrs.class
  } : {};
  return React.createElement('td', props, children);
};
const tableHeaderNodeResolver = function (children, attrs) {
  const props = attrs ? {
    className: attrs.class
  } : {};
  return React.createElement('th', props, children);
};
const defaultNodeResolvers = {
  [NODE_HEADING]: headingNodeResolver,
  [NODE_CODEBLOCK]: codeblockNodeResolver,
  [NODE_IMAGE]: imageNodeResolver,
  [NODE_PARAGRAPH]: simpleNodeResolver('p'),
  [NODE_QUOTE]: simpleNodeResolver('blockquote'),
  [NODE_OL]: simpleNodeResolver('ol'),
  [NODE_UL]: simpleNodeResolver('ul'),
  [NODE_LI]: simpleNodeResolver('li'),
  [NODE_HR]: emptyNodeResolver('hr'),
  [NODE_BR]: emptyNodeResolver('br'),
  [NODE_EMOJI]: emojiNodeResolver,
  [NODE_TABLE]: tableNodeResolver,
  [NODE_TABLE_ROW]: tableRowNodeResolver,
  [NODE_TABLE_CELL]: tableCellNodeResolver,
  [NODE_TABLE_HEADER]: tableHeaderNodeResolver
};
const defaultMarkResolvers = {
  [MARK_LINK]: linkMarkResolver,
  [MARK_STYLED]: styledMarkResolver,
  [MARK_BOLD]: simpleMarkResolver('b'),
  [MARK_ITALIC]: simpleMarkResolver('i'),
  [MARK_STRIKE]: simpleMarkResolver('s'),
  [MARK_UNDERLINE]: simpleMarkResolver('u'),
  [MARK_CODE]: simpleMarkResolver('code'),
  [MARK_SUBSCRIPT]: simpleMarkResolver('sub'),
  [MARK_SUPERSCRIPT]: simpleMarkResolver('sup'),
  [MARK_HIGHLIGHT]: highlightMarkResolver,
  [MARK_TEXT_STYLE]: textStyleMarkResolver,
  [MARK_ANCHOR]: anchorMarkResolver
};

export { MARK_ANCHOR, MARK_BOLD, MARK_CODE, MARK_HIGHLIGHT, MARK_ITALIC, MARK_LINK, MARK_STRIKE, MARK_STYLED, MARK_SUBSCRIPT, MARK_SUPERSCRIPT, MARK_TEXT_STYLE, MARK_UNDERLINE, NODE_BR, NODE_CODEBLOCK, NODE_EMOJI, NODE_HEADING, NODE_HR, NODE_IMAGE, NODE_LI, NODE_OL, NODE_PARAGRAPH, NODE_QUOTE, NODE_TABLE, NODE_TABLE_CELL, NODE_TABLE_HEADER, NODE_TABLE_ROW, NODE_UL, render };
//# sourceMappingURL=index.es.js.map
