import React from "react";
import WeUI from "react-weui";
import QRCode from "qrcode.react";
import md5 from "md5";
const {
  Article,
  Page,
  Button,
  CellsTitle,
  Form,
  FormCell,
  CellHeader,
  CellBody,
  Label,
  Input,
  CellFooter,
  VCode,
  vcodeSrc,
  ButtonArea,
  TextArea,
  Toast,
  Image,
  Toptips
} = WeUI;

export default class BDAddressEdit extends React.Component {
  componentWillUnmount() {
    this.state.toastTimer && clearTimeout(this.state.toastTimer);
    this.state.loadingTimer && clearTimeout(this.state.loadingTimer);
  }
  GetQueryString = name => {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = decodeURI(window.location.search.substr(1)).match(reg);
        if (r != null)return unescape(r[2]);
    return null;
  }
  componentDidMount() {


  }
  sendVcode = async () => {
    const { phone } = this.state;
    let result = "";
    const sign = md5(phone + "_yiyiaitech.com");
    result = await fetch(
      "http://localhost:8080/shuyutong/SendSms?user_key=" +
      phone +
      "&sign=" +
      sign,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        mode: "cors",
        cache: "default",
        credentials: "include"
      }
    ).then(res => res.json());
    console.log("result", result);
    if (result.Code != "OK") {
      this.setState({ showToptips: true, topTips: "发送短信失败，请检查" });
    } else {
      this.setState({ showToptips: true, topTips: "发送短信成功" });
    }
  };
  showToast = async () => {
    const { phone, vcode } = this.state;
    this.setState({ showToast: true });
    const sign = md5(phone + "_yiyiaitech.com");
    const result = await fetch(
      "http://localhost:8080/shuyutong/plugInSmsVerification?userid=" +
      phone +
      "&verifycode=" +
      vcode +
      "&authedkey=web&call_time=111",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        mode: "cors",
        cache: "default",
        credentials: "include"
      }
    ).then(res => res.json());

    this.state.toastTimer = setTimeout(() => {
      this.setState({ showToast: false });
      //this.clickHandle("/address");
    }, 800);
  };

  clickHandle(url) {
    this.props.history.push(url);
  }

  state = {
    showToast: false,
    phone: "",
    name: "",
    company: "",
    vcode: "",
    topTips: "发送短信成功"
  };

  handleChange = e => {
    console.log("event", e);
    this.setState({ name: e.target.value });
  };

  handlePhoneChange = e => {
    console.log("event", e);
    this.setState({ phone: e.target.value });
  };

  handleVcodeChange = e => {
    console.log("event", e);
    this.setState({ vcode: e.target.value });
  };

  handleCompanyChange = e => {
    console.log("event", e);
    this.setState({ company: e.target.value });
  };
  render() {
    return (
      <Page transition={true} infiniteLoader={true} ptr={false}>
        <CellsTitle>企业帐号注册</CellsTitle>
        <Form>
          <FormCell>
            <CellHeader>
              <Label>联系人</Label>
            </CellHeader>
            <CellBody>
              <Input
                placeholder="请填写联系人"
                value={this.state.name}
                onChange={this.handleChange}
              />
            </CellBody>
          </FormCell>
          <FormCell>
            <CellHeader>
              <Label>企业名称</Label>
            </CellHeader>
            <CellBody>
              <Input
                placeholder="请填写企业名称"
                value={this.state.company}
                onChange={this.handleCompanyChange}
              />
            </CellBody>
          </FormCell>
          <FormCell>
            <CellHeader>
              <Label>手机号</Label>
            </CellHeader>
            <CellBody>
              <Input
                placeholder="请填写手机号"
                value={this.state.phone}
                onChange={this.handlePhoneChange}
              />
            </CellBody>
            <CellFooter>
              <Button type="vcode" onClick={this.sendVcode}>
                发送验证码
              </Button>
            </CellFooter>
          </FormCell>
          <FormCell>
            <CellHeader>
              <Label>验证码</Label>
            </CellHeader>
            <CellBody>
              <Input
                placeholder="请填写验证码"
                value={this.state.vcode}
                onChange={this.handleVcodeChange}
              />
            </CellBody>
          </FormCell>
        </Form>

        <ButtonArea>
          <Button onClick={this.showToast}>提交</Button>
        </ButtonArea>

        <Toast icon="success-no-circle" show={this.state.showToast}>
          操作成功
        </Toast>
        <Toptips type="warn" show={this.state.showToptips}>
          {this.state.topTips}
        </Toptips>
      </Page>
    );
  }
}
