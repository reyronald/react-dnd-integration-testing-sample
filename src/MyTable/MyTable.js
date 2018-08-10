// @flow
import * as React from "react";
import { Table } from "antd";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import update from "immutability-helper";
import DraggableBodyRow from "./DraggableBodyRow";

type S = {
  data: Array<{
    key: string,
    name: string,
    age: number,
    address: string
  }>
};

class MyTable extends React.Component<{ style: CSSStyleDeclaration }, S> {
  state = {
    data: [
      {
        key: "1",
        name: "Alice",
        age: 32,
        address: "New York No. 1 Lake Park"
      },
      {
        key: "2",
        name: "Bob",
        age: 42,
        address: "London No. 1 Lake Park"
      },
      {
        key: "3",
        name: "Clark",
        age: 32,
        address: "Sidney No. 1 Lake Park"
      }
    ]
  };

  components = {
    body: {
      row: DraggableBodyRow
    }
  };

  onRow = (record, index) => ({
    index,
    moveRow: this.moveRow
  });

  moveRow = (dragIndex: number, hoverIndex: number) => {
    this.setState(prevState => {
      const { data } = update(prevState, {
        data: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, prevState.data[dragIndex]]]
        }
      });

      return { data };
    });
  };

  render() {
    return (
      <Table
        {...this.props}
        bordered
        columns={[
          {
            title: "Name",
            dataIndex: "name",
            key: "name"
          },
          {
            title: "Age",
            dataIndex: "age",
            key: "age"
          },
          {
            title: "Address",
            dataIndex: "address",
            key: "address"
          }
        ]}
        dataSource={this.state.data}
        components={this.components}
        onRow={this.onRow}
      />
    );
  }
}

export default DragDropContext(HTML5Backend)(MyTable);
