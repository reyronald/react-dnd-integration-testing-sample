// @flow
import * as React from "react";
import { DragSource, DropTarget } from "react-dnd";
import { css } from "react-emotion";
import type { ConnectDragSource, ConnectDropTarget } from "react-dnd";

function dragDirection(
  dragIndex: number,
  hoverIndex: number,
  initialClientOffset: { x: number, y: number },
  clientOffset: { x: number, y: number },
  sourceClientOffset: { x: number, y: number }
): "downward" | "upward" | void {
  const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
  const hoverClientY = clientOffset.y - sourceClientOffset.y;
  if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
    return "downward";
  }
  if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
    return "upward";
  }
}

const downward = css`
  label: downward;
  td {
    border-bottom: 2px dashed #1890ff !important;
  }
`;

const upward = css`
  label: upward;
  td {
    border-top: 2px dashed #1890ff;
  }
`;
type P = {
  isOver: boolean,
  connectDragSource: ConnectDragSource,
  connectDropTarget: ConnectDropTarget,
  moveRow: (dragIndex: number, hoverIndex: number) => void,
  dragRow: { index: number },
  clientOffset: { x: number, y: number },
  sourceClientOffset: { x: number, y: number },
  initialClientOffset: { x: number, y: number },
  style: CSSStyleDeclaration,
  index: number,
  className: string
};

function BodyRow(props: P) {
  const {
    isOver,
    connectDragSource,
    connectDropTarget,
    moveRow,
    dragRow,
    clientOffset,
    sourceClientOffset,
    initialClientOffset,
    ...restProps
  } = props;
  const style = { ...restProps.style, cursor: "move" };

  let className = restProps.className;
  if (isOver && initialClientOffset) {
    const direction = dragDirection(
      dragRow.index,
      restProps.index,
      initialClientOffset,
      clientOffset,
      sourceClientOffset
    );
    if (direction === "downward") {
      className += " " + downward;
    }
    if (direction === "upward") {
      className += " " + upward;
    }
  }

  return connectDragSource(
    // Flow definitions for `connectDropTarget` are outdated,
    // it shouldn't return undefined:
    // https://github.com/react-dnd/react-dnd/blob/b72622268a64eeea4955816c8bd6e493583f530a/packages/react-dnd/src/interfaces.ts#L407-L409
    // $FlowIgnore
    connectDropTarget(<tr {...restProps} className={className} style={style} />)
  );
}

const rowSource = {
  beginDrag(props) {
    return {
      index: props.index
    };
  }
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  }
};

const DraggableBodyRow = DropTarget("row", rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  sourceClientOffset: monitor.getSourceClientOffset()
}))(
  DragSource("row", rowSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    dragRow: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset()
  }))(BodyRow)
);

export default DraggableBodyRow;
