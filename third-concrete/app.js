import Config from '/config.js';
import Output from '/output.js';

const size = '30px';

export default class App {
  static renderAll({isOn, setup}) {
    return Output.element({
      style: {
        display: 'flex',
      },
      children: Config.apps.map(app => {
        const on = isOn(app.appId);
        return Output.element({
          text: app.appId,
          style: {
            width: size,
            height: size,
            fontSize: '20px',
            borderStyle: 'solid',
            borderRadius: '100%',
            borderColor: 'black',
            textAlign: 'center',
            verticalAlign: 'middle',
            lineHeight: size,
            backgroundColor: on ? app.colour : 'white',
            color: on ? 'white' : 'black',
          },
          setup(element) {
            setup(element, app.appId, on);
          },
        });
      }),
    });
  }
};
