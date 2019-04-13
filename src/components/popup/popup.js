import React, { Component } from 'react';
import ReactModal from 'react-modal';
import { popupService } from '../../services';
import './popup.css';

export class Popup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      children: undefined,
    };
  }
  componentDidMount() {
    ReactModal.setAppElement('#root');
    popupService.listen(({ show, children }) => this._update(show, children));
  }
  componentWillUnmount() {
    popupService.dispose();
  }
  _update(show, children) {
    this.setState({ show, children });
  }
  render() {
    const { show, children } = this.state;
    return (
      <ReactModal
        isOpen={show}
        className={'popup'}
        overlayClassName={'popup__overlay'}
      >
        {children}
      </ReactModal>
    );
  }
}
