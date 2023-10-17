(function anonymous(
  orders,
  selectedOrder,
  fontSize,
  h1Class,
  titleClass,
  timeClass,
  value
) {
  function createElement(name, attrs, ...children) {
    // console.log(arguments, { name, children, attrs });
    return { name, attrs, children };
  }
  return [
    createElement(
      "DIV",
      {
        class: "order",
      },
      createElement(
        "H1",
        {
          ":class": [h1Class],
        },
        createElement("TEXT", null, `订单详情`)
      ), //createElement
      ...((iter, fn) => {
        const type = typeof iter;
        if (type === "number")
          iter = new Array(iter).fill(undefined).map((v, i) => i);
        else if (type !== "object") return [];
        else if (iter === null) return [];

        console.log(iter);

        if (Array.isArray(iter)) {
          return iter.map((item, index) => fn(item, index));
        } else {
          return Object.entries(iter).map(([key, value], index) =>
            fn(key, value, index)
          );
        }
      })(
        orders,
        ({ id, time, user, goodsList }) =>
          createElement(
            "DIV",
            {
              ":key": `order-${id}`,
            },
            createElement(
              "H2",
              {
                ":class": [{ active: id === selectedOrder }, titleClass],
              },
              createElement("TEXT", null, `${user.name}`)
            ), //createElement
            createElement(
              "SPAN",
              {
                class: "sex",
                ":style": { fontSize: fontSize + "px" },
              },
              (() => {
                if (user.sex === 1) {
                  return createElement(
                    "SPAN",
                    {
                      style: "color: greenyellow;",
                    },
                    createElement("TEXT", null, `男`)
                  ); //createElement
                } else {
                  return createElement(
                    "SPAN",
                    {
                      style: "color: pink;",
                    },
                    createElement("TEXT", null, `女`)
                  ); //createElement
                }
              })()
            ), //createElement
            createElement(
              "SPAN",
              {
                ":style": { fontSize: fontSize + "px" },
              },
              createElement(
                "TEXT",
                null,
                `年龄：${user.age}
          `
              )
            ), //createElement
            createElement(
              "DIV",
              {
                ":class": { title: true, active: id === selectedOrder },
              },
              createElement("TEXT", null, `订单号：${id}`)
            ), //createElement
            createElement(
              "DIV",
              {
                ":style": { color: "grey" },
              },
              createElement("TEXT", null, `订单时间：${formatTime(time)}`)
            ), //createElement
            createElement(
              "DIV",
              {
                class: "goodsList",
              },
              ...((iter, fn) => {
                const type = typeof iter;
                if (type === "number")
                  iter = new Array(iter).fill(undefined).map((v, i) => i);
                else if (type !== "object") return [];
                else if (iter === null) return [];

                console.log(iter);

                if (Array.isArray(iter)) {
                  return iter.map((item, index) => fn(item, index));
                } else {
                  return Object.entries(iter).map(([key, value], index) =>
                    fn(key, value, index)
                  );
                }
              })(
                goodsList,
                ({ id, name, price, num }, index) =>
                  createElement(
                    "DIV",
                    {
                      ":key": `goods-${id}-${index}`,
                      class: "goodsCard",
                    },
                    createElement(
                      "DIV",
                      {},
                      createElement("TEXT", null, `商品名称：${name}`)
                    ), //createElement
                    createElement(
                      "DIV",
                      {},
                      createElement("TEXT", null, `商品价格：¥${price}`)
                    ), //createElement
                    createElement(
                      "DIV",
                      {},
                      createElement("TEXT", null, `商品数量：${num}`)
                    ), //createElement
                    createElement(
                      "DIV",
                      {},
                      createElement("TEXT", null, `商品总价：${num * price}`)
                    ) //createElement
                  ) //createElement
              )
            ) //createElement
          ) //createElement
      )
    ), //createElement
    createElement(
      "DIV",
      {
        class: "demo",
      },
      (() => {
        if (value === 1) {
          return createElement("DIV", {}, createElement("TEXT", null, `a`)); //createElement
        } else if (value === 2) {
          return createElement("DIV", {}, createElement("TEXT", null, `b`)); //createElement
        } else if (value === 3) {
          return createElement("DIV", {}, createElement("TEXT", null, `c`)); //createElement
        } else {
          return createElement("DIV", {}, createElement("TEXT", null, `d`)); //createElement
        }
      })(),
      createElement(
        "DIV",
        {
          "v-else": undefined,
        },
        createElement("TEXT", null, `velse`)
      ), //createElement
      createElement(
        "DIV",
        {},
        createElement("SPAN", {}, createElement("TEXT", null, `${new Date()}`)), //createElement
        ...((iter, fn) => {
          const type = typeof iter;
          if (type === "number")
            iter = new Array(iter).fill(undefined).map((v, i) => i);
          else if (type !== "object") return [];
          else if (iter === null) return [];

          console.log(iter);

          if (Array.isArray(iter)) {
            return iter.map((item, index) => fn(item, index));
          } else {
            return Object.entries(iter).map(([key, value], index) =>
              fn(key, value, index)
            );
          }
        })(
          { a: 1, b: 2 },
          (key, value, idx) =>
            createElement(
              "DIV",
              {
                ":key": `obj-${key}-${idx}`,
              },
              createElement("TEXT", null, `${key}:${value}@${index}`)
            ) //createElement
        ),
        ...((iter, fn) => {
          const type = typeof iter;
          if (type === "number")
            iter = new Array(iter).fill(undefined).map((v, i) => i);
          else if (type !== "object") return [];
          else if (iter === null) return [];

          console.log(iter);

          if (Array.isArray(iter)) {
            return iter.map((item, index) => fn(item, index));
          } else {
            return Object.entries(iter).map(([key, value], index) =>
              fn(key, value, index)
            );
          }
        })(
          2,
          (item, index) =>
            createElement(
              "DIV",
              {
                class: "abcd",
                ":style": {
                  background: "orange",
                  width: "100px",
                  height: "100px",
                  display: "inline-block",
                },
                ":class": ["aaa"],
                ":key": `number-${index}`,
              },
              createElement("TEXT", null, `${item}@${index}`)
            ) //createElement
        )
      ) //createElement
    ), //createElement
  ];
});
