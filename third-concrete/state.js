import Device from '/device.js';
import Output from '/output.js';
import SyncAppIds from '/sync-app-ids.js';

export default class State {
  static history = [State.emptyState()];

  static index = 0;

  static emptyState() {
    return {
      devices: [Device.create()],
      syncAppIds: [],
    };
  }

  static mutate(mutation) {
    State.history.splice(State.index + 1);
    State.history.splice(State.index, 0, State.copy(State.history[State.index]));
    State.index++;
    mutation();
    Output.render();
  }

  static copy(state) {
    return JSON.parse(JSON.stringify(state));
  }
  
  static timeTravel(delta) {
    State.index = Math.min(Math.max(State.index + delta, 0), State.history.length - 1);
    Output.render();
  }
  
  static render() {
    const state = State.history[State.index];
    return Output.element({
      children: [
        Output.element({
          style: {
            marginBottom: '10px',
          },
          text: 'State history: ' + State.history.map((_, i) => i == State.index ? 'o' : '.').join(''),
        }),
        SyncAppIds.render(state.syncAppIds),
        Output.element({
          style: {
            marginTop: '10px',
          },
          text: 'Devices:',
        }),
        Output.element({
          tag: 'button',
          text: 'add device',
          setup(element) {
            element.addEventListener('click', event => {
              State.mutate(() => {
                state.devices.push(Device.create(state.devices.length));
              });
            });
          },
        }),
        Output.element({
          tag: 'button',
          text: 'update all devices',
          setup(element) {
            element.addEventListener('click', event => {
              State.mutate(() => {
                for (let device of state.devices) {
                  Device.updateApps(device, state.syncAppIds);
                }
              });
            });
          },
        }),
        Output.element({
          style: {
            marginTop: '10px',
            display: 'flex',
          },
          children: state.devices.map(device => Device.render(device, state.syncAppIds, state.devices)),
        }),
      ],
    });
  }
};
