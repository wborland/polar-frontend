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

const App = props => {
  return (
    <div>
      <Switch>
        <Route path="/login" render={() => <Login />}/>
        <Route path="/password" />
        <Route path="/register" component={Register} />

        <Route path="/" render={() => <BackgroundPage />} />
      </Switch>
      <Modal
        title={props.dialog.object.title}
        visible={props.dialog.open}
        onCancel={() => props._updateDialog(false, null)}
        footer={null}
      >
        {props.dialog.object.content}
      </Modal>
    </div>
  );
};

const mapStateToProps = state => ({
  dialog: state.dialog
});

const mapDispatchToProps = {
  _updateDialog: updateDialog
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
