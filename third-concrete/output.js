import State from '/state.js';

export default class Output {
  static print(text) {
    document.getElementById('output').textContent += text + '\n';
  }
  
  static element({tag='div', text=null, style=null, setup=null, children=[]}) {
    let element = document.createElement(tag);
    if (text != null) {
      element.textContent = text;
    }
    if (style) {
      for (const [property, value] of Object.entries(style)) {
        element.style[property] = value;
      }
    }
    if (setup) {
      setup(element);
    }
    for (let child of children) {
      element.appendChild(child);
    }
    return element;
  }

  static render() {
    let render = document.getElementById('render');
    render.childNodes.forEach(node => node.remove());
    render.appendChild(State.render());
  }
};
