import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Form, Button } from 'antd';


class AddRoleButton extends Component {


    render() {
        return (
            <div>
                <Button></Button>
            </div>
        )
    }
}


const mapStoreToProps = state => {
    return {
        user: state.user,
        location: state.router.location
    };
};

const mapDispatchToProps = {
    _push: push
  };
  
export default connect(mapStoreToProps, mapDispatchToProps)(AddRoleButton);
//replace null with mapStateToProps to connect to the state variables

