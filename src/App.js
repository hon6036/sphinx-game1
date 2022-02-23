import './App.css';
import { useState, Component, useEffect } from "react";
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import axios from 'axios';
import Web3 from 'web3';

class CustomSlide extends Component {
  render() {
    const {item, ...props} = this.props
    return (
      <div>
        <div className='Inner-slide-text'>{item[0]}</div>
        <img className='Inner-slide-image' src={item[1]}>
        </img>
      </div>
    )}
}

function App() {
  const [tab, setTap] = useState("NFT")
  const [noneNFTItemList, setNoneNFTItemList] = useState("a")
  const {NFTItemList, setNFTItemList} = useState({})
  const [activeSlide, setActiveSlide] = useState(0)
  const [account, setAccount] = useState("")
  const dummy = ''
  window.web3 = new Web3(window.ethereum);
  window.ethereum.enable();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (current, next) => setActiveSlide(next)
  }
  
  var renderSlide = ''

  useEffect(() => {
    if (noneNFTItemList !== "a") return;
    axios.post("http://localhost:3030/game1").then((res)=>{setNoneNFTItemList(res.data)
    getAccount()
    console.log(account)
  });
  }, [])
  async function getAccount() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    setAccount(accounts[0])
  }
  var imageurl =''
  var nameOfWeapon=''
  var nonNFTList = []
  if (tab === 'NFT') {
    imageurl = "/weapon/Weapon_Spectre.png"
    nameOfWeapon = "Weapon_Spectre"
  }
  else {
    for (var i in noneNFTItemList) {
      console.log(noneNFTItemList[i][1])
      nonNFTList.push({name: noneNFTItemList[i][0], imageurl: noneNFTItemList[i][1]})

    }
    console.log(nonNFTList)
    renderSlide = nonNFTList.map(item => {
      return (
        <CustomSlide key={item.name} item={[item.name, item.imageurl, activeSlide]}></CustomSlide>
      )
    })
  }
  function showNFT() {
    setTap('NFT')
    console.log("showNFT")
  }

  function showNoneNFT() {
    setTap('NoneNFT')
    console.log("showNoneNFT")
  }

  function mintNFT() {
    console.log(noneNFTItemList[0])
    const selectedItem = noneNFTItemList[activeSlide]
    console.log(selectedItem, "selectedItem")
    const url = "http://localhost:3000/game?name=" + selectedItem[0] + "&image=" + selectedItem[1] + "&stat=" + selectedItem[2] + "&game=" + selectedItem[3] + "&publicKey=" + account
    const link = document.createElement('a')
    link.href = url 
    link.click()
  }

  return (
    <div className="App">
      <div className='Inventory'>
        <button className={`Inventory-button ${tab === 'NFT' ? 'active' : ''}`} onClick={showNFT}>NFT Item</button>
        <br></br>
        <button className={`Inventory-button ${tab === 'NoneNFT' ? 'active' : ''}`} onClick={showNoneNFT}>None NFT Item</button>
        <div className='Weapon-background'>
            <Slider {...settings}>
              {renderSlide}
            </Slider>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            {
            (function() {
              if(tab === "NoneNFT" ) return (<button onClick={mintNFT} className='Mint-button'>Mint NFT</button>)
            })()
            }
        </div>
      </div>
    </div>
  );
}

export default App;
