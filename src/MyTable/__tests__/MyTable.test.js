import React from "react";
import { render } from "react-dom";
import MyTable from "..";

const NODE_TYPE = Object.freeze({
  ELEMENT_NODE: 1
});
window.Element.prototype.closest =
  window.Element.prototype.closest ||
  function(selectors) {
    // https://dom.spec.whatwg.org/#dom-element-closest
    let el = this;
    while (el && el.nodeType === NODE_TYPE.ELEMENT_NODE) {
      if (el.matches(selectors)) {
        return el;
      }
      el = el.parentNode;
    }
    return null;
  };

describe("MyTable", () => {
  it("drag and drop functionality works as expected", () => {
    // Arrange
    const component = <MyTable />;
    const mountNode = document.createElement("div");
    // Usually the following is not neccessary, but `react-dnd` adds event
    // listeners to the `window` object. If we don't attach our `mountNode` to
    // the body of the document then their listeners won't get called.
    // https://github.com/react-dnd/react-dnd/issues/556
    document.body.appendChild(mountNode);

    const getTableCells = () =>
      Array.from(mountNode.querySelectorAll("tr td:nth-of-type(1)"));

    const createBubbledEvent = (type, props = {}) => {
      const event = new Event(type, { bubbles: true });
      Object.assign(event, props);
      return event;
    };

    // Act 1
    render(component, mountNode);

    // Assert 1: Initial order of the rows
    expect(getTableCells().map(cell => cell.textContent)).toEqual([
      "Alice",
      "Bob",
      "Clark"
    ]);

    // Act & Assert 2: Drag-and-dropping in place doesn't change the order
    const tableCells0 = getTableCells();
    const startingNode0 = tableCells0[0];
    const endingNode0 = tableCells0[0];
    startingNode0.dispatchEvent(
      createBubbledEvent("dragstart", { clientX: 0, clientY: 0 })
    );
    endingNode0.dispatchEvent(
      createBubbledEvent("drop", { clientX: 0, clientY: 0 })
    );
    expect(getTableCells().map(cell => cell.textContent)).toEqual([
      "Alice",
      "Bob",
      "Clark"
    ]);

    // Act & Assert 3: Drag-and-dropping downward
    const tableCells1 = getTableCells();
    const startingNode1 = tableCells1[0];
    const endingNode1 = tableCells1[2];
    startingNode1.dispatchEvent(
      createBubbledEvent("dragstart", { clientX: 0, clientY: 0 })
    );
    endingNode1.dispatchEvent(
      createBubbledEvent("dragover", { clientX: 0, clientY: 1 })
    );
    expect(
      Array.from(endingNode1.closest("tr").classList).some(c =>
        c.endsWith("-downward")
      )
    ).toBeTruthy();

    endingNode1.dispatchEvent(
      createBubbledEvent("drop", { clientX: 0, clientY: 1 })
    );
    expect(getTableCells().map(cell => cell.textContent)).toEqual([
      "Bob",
      "Clark",
      "Alice"
    ]);

    // Act & Assert 4: Drag-and-dropping upward
    const tableCells2 = getTableCells();
    const startingNode2 = tableCells2[2];
    const endingNode2 = tableCells2[1];

    startingNode2.closest("tr").getBoundingClientRect = () => ({
      top: 20,
      left: 0
    });

    startingNode2.dispatchEvent(
      createBubbledEvent("dragstart", { clientX: 0, clientY: 20 })
    );
    endingNode2.dispatchEvent(
      createBubbledEvent("dragover", { clientX: 0, clientY: 10 })
    );
    expect(
      Array.from(endingNode2.closest("tr").classList).some(c =>
        c.endsWith("-upward")
      )
    ).toBeTruthy();
    endingNode2.dispatchEvent(
      createBubbledEvent("drop", { clientX: 0, clientY: 10 })
    );
    expect(getTableCells().map(cell => cell.textContent)).toEqual([
      "Bob",
      "Alice",
      "Clark"
    ]);
  });
});
