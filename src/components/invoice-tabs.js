import React from 'react';
import { Tabs } from 'antd';
import MainInvoiceTable from './main-invoice-table';
import SubInvoiceTable from './sub-invoice-table';
import { CurrentInvoiceContext } from '../current-invoice-context';

const TabPane = Tabs.TabPane;

export default class InvoiceTabs extends React.Component {
  state = {
    activeKey: 'main',
  };

  onChange = activeKey => this.setState({ activeKey });
  onEdit = (targetKey, action) => this[action](targetKey);
  add = () => this.props.onNewTab();

  getSubTabsConfig = (subInvoices) => {
    return subInvoices.map((subInvoice, index) => {
      const { name, discountPercent } = subInvoice;

      return {
        title: `${name} (${discountPercent}%)`,
        key: index,
        closable: false,
        subInvoice,
      };
    });
  }

  render() {
    const { activeKey } = this.state;

    return (
      <CurrentInvoiceContext.Consumer>
        {({
            currentInvoice,
            onAddNewRowToSubInvoice,
            onSaveSubInvoiceRow,
            onDeleteSubInvoiceRow,
          }) => {
          const { subInvoices } = currentInvoice;
          const subInvoiceTabs = this.getSubTabsConfig(subInvoices);

          return (
            <Tabs
              onChange={this.onChange}
              activeKey={activeKey}
              type="editable-card"
              onEdit={this.onEdit}
            >
              <TabPane tab="Chính" key="main" closable={false}>
                <MainInvoiceTable currentInvoice={currentInvoice} />
              </TabPane>

              {subInvoiceTabs.map(({ title, key, closable, subInvoice }) => (
                <TabPane tab={title} key={key} closable={closable}>
                  <SubInvoiceTable
                    subInvoiceIndex={key}
                    subInvoice={subInvoice}
                    onAddNewRowToSubInvoice={onAddNewRowToSubInvoice}
                    onSaveSubInvoiceRow={onSaveSubInvoiceRow}
                    onDeleteSubInvoiceRow={onDeleteSubInvoiceRow}
                  />
                </TabPane>
              ))}
            </Tabs>
          );
        }}
      </CurrentInvoiceContext.Consumer>
    );
  }
}
