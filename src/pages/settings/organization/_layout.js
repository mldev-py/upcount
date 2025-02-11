import { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'dva';
import { Field, Form, reduxForm } from 'redux-form';
import { Button, Col, Icon, Layout, Row } from 'antd';

import { AInput, APhoneInput, ATextarea } from '../../../components/forms/fields';

class Organization extends Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'organizations/initialize',
      payload: {
        id: localStorage.getItem('organization'),
      },
    });
  }

  render() {
    const { handleSubmit, pristine, submitting } = this.props;

    return (
      <div>
        <Layout.Content style={{ margin: 16, padding: 24, background: '#fff' }}>
          <Row gutter={32}>
            <Col span={12}>
              <h2>
                <Icon type="home" />
                {` Organization details`}
              </h2>
              <Form layout="vertical" onSubmit={handleSubmit}>
                <Field name="name" component={AInput} label="Name" />
                <Field name="address" component={ATextarea} rows={4} label="Address" />
                <Field name="email" component={AInput} label="Email" />
                <Field name="phone" component={APhoneInput} label="Phone" />
                <Row gutter={16}>
                  <Col span={12}>
                    <Field name="vatin" component={AInput} label="VATIN" />
                  </Col>
                  <Col span={12}>
                    <Field name="website" component={AInput} label="Website" />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={pristine || submitting}
                      loading={submitting}
                      style={{ marginTop: '10px' }}
                    >
                      Save
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Layout.Content>
      </div>
    );
  }
}

export default compose(
  connect(state => ({})),
  reduxForm({
    form: 'organization',
    onSubmit: async (data, dispatch) => {
      return await dispatch({ type: 'organizations/save', data: data });
    },
    onSubmitSuccess: (result, dispatch) => {
      dispatch({
        type: 'organizations/initialize',
        payload: {
          id: localStorage.getItem('organization'),
        },
      });
    },
  })
)(Organization);
