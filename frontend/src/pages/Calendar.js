import React, { useContext, useState, useEffect } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useMetaMask } from "metamask-react";
import { Layout, Calendar, Button, Modal, Card } from "antd";
import { Web3Context } from "..";

const { Header, Content } = Layout;

dayjs.extend(customParseFormat);

const disabledDate = (current) => {
  // Can not select days before today and today
  return current > dayjs().endOf("day");
};

function CalendarView() {
  const { database, alchemy } = useContext(Web3Context);
  const [pickDate, setPickDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [currentMonth, setCurrentMonth] = useState(dayjs().format("YYYYMM"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalFocus, setModalFocus] = useState({
    title: "",
    content: [],
  });
  const [data, setData] = useState([]);

  const onChange = (date, dateString) => {
    setPickDate(date.format("YYYY-MM-DD"));
    monthToNotes(date.format("YYYYMM"));
    if (date.format("YYYYMM") !== currentMonth) {
      setData([]);
      monthToNotes(date.format("YYYYMM"));
      setCurrentMonth(date.format("YYYYMM"));
    }
  };

  const getListData = (value) => {
    let listData = [];
    data.map((note) => {
      //console.log("compare:", note.date, value);
      if (note.date === value) {
        listData.push(note.content);
      }
    });
    return listData;
  };

  const { status, connect, account, chainId, ethereum } = useMetaMask();

  const getNote_arweave = async (date, txId) => {
    const transaction = await database.getData(txId)
    if (transaction) {
      const decrypted = await database.decryptByPrivateKey(
        transaction,
        JSON.parse(localStorage.getItem("mnemonicPhrase"))
      );
      setData((prev) => [
        ...prev,
        {
          date: `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}`,
          content: decrypted,
        },
      ]);
    } else {
      setData((prev) => [
        ...prev,
        [
          {
            date: `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}`,
            content: "<Now pending...>",
          },
        ],
      ]);
    }
  };

  const monthToNotes = (month) => {
    alchemy.monthToNotes(ethereum, account, month).then((encodedResult) => {
      const arr = alchemy.interface.decodeFunctionResult(
        alchemy.interface.functions["monthToNotes(uint256)"],
        encodedResult
      );
      arr.map((element) => {
        element.map((item) => {
          getNote_arweave(item[0], item[1]);
        });
      });
    });
  };

  useEffect(() => {
    monthToNotes(dayjs().format("YYYYMM"));
  }, []);

  const viewNote = (e) => {
    //console.log(getListData(e.target.parentNode.value));
    setModalFocus({
      title: e.target.parentNode.value,
      content: getListData(e.target.parentNode.value),
    });
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const dateCellRender = (value) => {
    const num = getListData(value.format("YYYY-MM-DD"));
    if (value < dayjs().endOf("day")) {
      return num.length !== 0 ? (
        <div
          className="notes-month"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <>
            <Button
              className="viewButton"
              value={value.format("YYYY-MM-DD")}
              key={value.format("YYYY-MM-DD")}
              onClick={(e) => viewNote(e)}
              style={{ marginTop: 5, marginLeft: 5, marginRight: 2, width: 65 }}
            >
              <p style={{ fontSize: 15 }}>View</p>
            </Button>
          </>

          <div style={{ fontSize: 50 }}>{num.length}</div>
        </div>
      ) : (
        <div className="notes-month">
          <div style={{ fontSize: 50, color: "#ffffff" }}></div>
        </div>
      );
    }
  };

  return (
    <Layout className="site-layout">
      <div className="site-calendar-demo-card" style={{}}>
        <Modal
          title={modalFocus.title}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          {modalFocus.content.map((item) => (
            <Card style={{ marginBottom: 30 }}>{item}</Card>
          ))}
        </Modal>
        <Calendar
          dateCellRender={dateCellRender}
          disabledDate={disabledDate}
          onChange={onChange}
        />
      </div>
    </Layout>
  );
}
export default CalendarView;
