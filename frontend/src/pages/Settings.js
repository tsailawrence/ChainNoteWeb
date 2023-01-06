import React from "react";
import { message } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownCircleOutlined,
} from "@ant-design/icons";
import { List, Space, Layout, Button, Tabs, Card, Divider } from "antd";
import { useState, useEffect } from "react";
import { useApp } from "../UseApp";
import { useMetaMask } from "metamask-react";

const { Header, Content } = Layout;

function Settings({ setLogin }) {
  const { status, connect, account, chainId, ethereum } = useMetaMask();

  return (
    <Layout className="site-layout">
      <Content
        className="site-layout-background"
        style={{
          // margin: '24px 16px',
          padding: 24,
          paddingTop: 40,
          minHeight: 280,
          borderRadius: 20,
          marginTop: 50,
          marginBottom: 50,
          marginRight: "30%",
          //   filter: "drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.2))",
        }}
      >
        <h1>Settings</h1>
      </Content>
    </Layout>
  );
}
export default Settings;
