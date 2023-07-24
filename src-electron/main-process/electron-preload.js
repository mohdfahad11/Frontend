let isDev = false;
try {
  isDev = require('electron-is-dev')
} catch (error) {
  isDev = false;
}

const { contextBridge, remote } = require('electron');
const escpos = require('escpos');

const path = require('path')
const currentFolder = path.resolve(__dirname, '')
const { PosPrinter } = remote.require("electron-pos-printer");

if (isDev) {
  escpos.USB = remote.require('../../public/utils/escpos-usb');
} else {
  escpos.USB = remote.require(path.join(currentFolder, 'utils', 'escpos-usb'));
}

contextBridge.exposeInMainWorld(
  'cashDrawer', {
  openCashDrawer: () => {
    try {
      const usbDevice = new escpos.USB();
      const options = {}
      const usbPrinter = new escpos.Printer(usbDevice, options);
      usbDevice.open((error) => {
        usbPrinter.cashdraw(2).close();
        console.log('Found Error updated: ', { error })
      })
    } catch (error) {
      console.log('Getting Error', { error })
    }
  },

  printerOptions: () => {
    try {
      return remote.getCurrentWebContents().getPrinters()
    } catch (error) {
      console.log('Getting Error', { error })
    }
  },

  printReceiptFun: (options, printContent) => {
    try {
      const data = [
        {
          type: "text",
          value: printContent,
          style: { fontFamily: "'Courier New', monospace", fontSize: '10px' },
        },
      ];
      PosPrinter.print(data, options)
        .then((response) => {
          console.log(response)
        })
        .catch((error) => {
          console.error(error);
        });

    } catch (error) {
      console.log('Getting Error', { error })
    }
  }
}
)
