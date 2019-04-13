import { EventEmitter } from 'fbemitter';

const popupChanged = 'popup-changed';
class PopupService {
  constructor() {
    this._emitter = new EventEmitter();
  }
  listen(callback) {
    this._emitter.addListener(popupChanged, callback);
  }
  open(children) {
    this._emitter.emit(popupChanged, { show: true, children });
  }
  close() {
    this._emitter.emit(popupChanged, { show: false });
  }
  dispose() {
    this._emitter.removeAllListeners();
  }
}
export const popupService = new PopupService();
