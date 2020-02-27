import React from "react";
import { Switch, Route } from "react-router";
import { connect } from "react-redux";
import "antd/dist/antd.css";
import "./App.css";
import BackgroundPage from "./Pages/backgroundPage";
import Login from "./Pages/Login";
import { Modal } from "antd";
import { updateDialog } from "./Redux/dialog";
import Register from "./Pages/Register";
import ResetPassword from "./Pages/ResetPassword";
import { push, replace } from "connected-react-router";
import {history} from "./Redux/store"

const renderContent = props => {
  if (props.dialog.object.content == null) {
    return null;
  }
  if (!isClassComponent(props.dialog.object.content)) {
    return props.dialog.object.content;
  }
  const Content = props.dialog.object.content;
  return <Content />;
};

const isClassComponent = component => {
  return typeof component === "function" &&
  !!component.prototype.isReactComponent
    ? true
    : false;
};

const App = props => {
  const path = (/#!(\/.*)$/.exec(props.router.history.location.hash) || [])[1];
if (path) {
    props._replace(path);
}
  return (
    <div>
      <Switch>
        <Route path="/login" component={Login}/>
        <Route path="/resetpassword" component={ResetPassword}/>
        <Route path="/register" component={Register} />
        <Route path="/" render={() => <BackgroundPage />} />
      </Switch>
      <Modal
        title={props.dialog.object.title || ""}
        visible={props.dialog.open}
        onCancel={() => props._updateDialog(false, null)}
        footer={null}
      >
        {renderContent(props)}
      </Modal>
    </div>
  );
};

const mapStateToProps = state => ({
  dialog: state.dialog,
  router: state.router
});

const mapDispatchToProps = {
  _updateDialog: updateDialog,
  _replace: replace
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
