import { Component } from 'react';
import { connect } from 'dva';
import { Button, Icon, Input, Layout, Table, Tag, Row, Col } from 'antd';
import { compact, find, filter, flatten, get, escapeRegExp, pick, isEmpty, values } from 'lodash';

import Link from 'umi/link';

class Clients extends Component {
  state = {
    search: null,
  };

  componentDidMount() {
    this.props.dispatch({ type: 'clients/list' });
  }

  onSearch = value => {
    this.setState({
      search: value,
    });
  };

  render() {
    const { children, clients } = this.props;
    const { search } = this.state;

    // Search - to be implemented in DB
    let searchedClientItems = [];
    if (search) {
      searchedClientItems = filter(values(clients.items), client => {
        const searchable = flatten(
          compact(values(pick(client, ['name', 'address', 'emails', 'phone', 'vatin', 'website'])))
        );
        return find(searchable, value => {
          return !!~value.search(new RegExp(escapeRegExp(search), 'i'));
        });
      });
    }

    return (
      <Layout.Content style={{ margin: 16, padding: 24, background: '#fff' }}>
        <Row>
          <Col>
            <h2>
              <Icon type="team" style={{ marginRight: 8 }} />
              Clients
            </h2>
          </Col>
        </Row>
        <Link to="/clients/new">
          <Button type="primary" style={{ marginBottom: 10 }}>
            New client
          </Button>
        </Link>
        <Input.Search
          placeholder="Search text"
          onChange={e => this.onSearch(e.target.value)}
          style={{ width: 200, float: 'right' }}
        />
        <Table
          dataSource={search ? searchedClientItems : values(clients.items)}
          pagination={false}
          rowKey="_id"
        >
          <Table.Column
            title="Name"
            key="name"
            render={client => <Link to={`/clients/${client._id}`}>{get(client, 'name', '-')}</Link>}
          />
          <Table.Column title="Address" dataIndex="address" key="address" />
          <Table.Column
            title="Emails"
            dataIndex="emails"
            key="emails"
            render={emails => (emails ? emails.map(email => <Tag key={email}>{email}</Tag>) : '')}
          />
          <Table.Column
            title="Phone"
            dataIndex="phone"
            key="phone"
            render={phone => {
              if (!isEmpty(phone)) {
                return (
                  <a href={`tel:${phone}`}>
                    <Icon type="phone" />
                    {` ${phone}`}
                  </a>
                );
              }
            }}
          />
          <Table.Column title="VATIN" dataIndex="vatin" key="vatin" />
          <Table.Column
            title="Website"
            dataIndex="website"
            key="website"
            render={website => (
              <a href={website} target="_blank" rel="noreferrer noopener">
                {website}
              </a>
            )}
          />
        </Table>
        {children}
      </Layout.Content>
    );
  }
}

export default connect(state => {
  return { clients: state.clients };
})(Clients);
