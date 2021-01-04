App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var carsRow = $('#carsRow');
      var carTemplate = $('#carTemplate');

      for (i = 0; i < data.length; i ++) {
        carTemplate.find('.panel-title').text(data[i].name);
        carTemplate.find('img').attr('src', data[i].picture);
        carTemplate.find('.car-family').text(data[i].family);
        carTemplate.find('.car-location').text(data[i].madein);
        carTemplate.find('.car-cost').text(data[i].cost);
        carTemplate.find('.btn-buy').attr('data-id', data[i].id);
        carTemplate.find('.btn-release').attr('data-id', data[i].id);

        carsRow.append(carTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    
    if (window.ethereum)
    {
      App.web3Provider = window.ethereum;
      try{

        await window.ethereum.enable();

      }
      catch (error)
      {
        console.error("User denied account access")
      }

    }
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
      }
      else {
        //if no injected web3 instance is detected then fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      }
      web3 = new Web3(App.web3Provider);


    return App.initContract();
  },

  // call this function whenever i initialize the contract
  initContract: function() {
    $.getJSON('BuyCar.json', function (data) {
      var BuyCarArtifact = data;
      App.contracts.BuyCar = TruffleContract(BuyCarArtifact);

      //set the provider to interact with my contract
      App.contracts.BuyCar.setProvider(App.web3Provider);
      

      return App.markBought();
});


    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-buy', App.handleBuyCar);
    $(document).on('click', '.btn-release', App.handleReleaseCar);


  },

  markBought: function(buyers, account) {
    //console.log('markBought', buyers,account)
    var buyingInstance;
    App.contracts.BuyCar.deployed().then(function (instance) {
      buyingInstance = instance;

      return buyingInstance.getBuyers.call();//.call not a txn
    }).then(function (buyers) {
      for (i = 0; i < buyers.length; i++) {
        if (buyers[i] !== '0x0000000000000000000000000000000000000000') //&& (document.getElementById("buy") ==function(buyers, account)
        {
         // $('.panel-car').eq(i).find('button').text('Success').attr('disabled',true);
        // $('.panel-car').eq(i).find('.btn-buy').text('Success').attr('disabled',true);
        $('.panel-car').eq(i).find('.btn-buy').text('Success').attr('disabled',true);
        $('.panel-car').eq(i).find('btn-release').show();
        $('.panel-car').eq(i).find('btn-sell').show();
        $('.panel-car').eq(i).find('.car-buyer').text(buyers[i].substring(0,16));

}else
{
  $('.panel-car').eq(i).find('.btn-buy').show();
  $('.panel-car').eq(i).find('btn-sell').show();
  $('.panel-car').eq(i).find('.btn-release').hide();
  $('.panel-car').eq(i).find('.car-buyer').text('NULL');

}
      }
}).catch(function (err) {
console.log(err.message);
});



  },

  handleBuyCar: function(event) {
    event.preventDefault();

    var carId = parseInt($(event.target).data('id'));
    var carcost = parseInt($(event.target).data('cost'));
    var buyingInstance;
    //the accounts variable represents all the accounts on blockchain provided by Ganache
    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
      console.log(error);
      }
      var account = accounts[0];

      var weiValue= web3.toWei(carcost, 'ether');

      App.contracts.BuyCar.deployed().then(function (instance) {
      buyingInstance = instance;

      //web3.eth.sendTransaction({from: web3.eth.coinbase, to: account, value: weiValue});

      return buyingInstance.buy(carId, { from: web3.eth.accounts[0], value: weiValue });
      }).then(function (value) {
      return App.markBought();
      }).catch(function (err) {
      console.log(err.message);
      });
      
    });


  },

  handleReleaseCar: function(event) {
    event.preventDefault();

    var carId = parseInt($(event.target).data('id'));
    
    var releasingInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
      console.log(error);
      }

      var account = accounts[0];

      App.contracts.BuyCar.deployed().then(function (instance) {
      releasingInstance = instance;

      return releasingInstance.release(carId, { from: account });
      }).then(function (result) {
      return App.markBought();
      }).catch(function (err) {
      console.log(err.message);
      });
      });

     }





};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
