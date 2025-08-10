(() => {
  var __commonJS = (callback, module) => () => {
    if (!module) {
      module = {exports: {}};
      callback(module.exports, module);
    }
    return module.exports;
  };

  // build/background.js
  var require_background = __commonJS((exports) => {
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    chrome.runtime.onInstalled.addListener((details) => {
      if (details.reason === "install") {
      }
      const prevVersion = details.previousVersion;
      const thisVersion = chrome.runtime.getManifest().version;
      if (details.reason === "update") {
        if (prevVersion != thisVersion) {
          console.log(`Updated from ${prevVersion} to ${thisVersion}!`);
        }
      }
    });
    chrome.runtime.onStartup.addListener(() => __awaiter(exports, void 0, void 0, function* () {
      var _a;
      let icon = "res/icon.png";
      (_a = chrome.browserAction) === null || _a === void 0 ? void 0 : _a.setIcon({path: {"16": icon}});
    }));
    chrome.runtime.onConnect.addListener((port) => {
      switch (port.name) {
        case "intentStatus": {
          port.onMessage.addListener((msg) => intentHandler(port, msg));
        }
      }
    });
    function intentHandler(port, msg) {
      return __awaiter(this, void 0, void 0, function* () {
        const intent = msg.intent;
        console.log(`Success! Redirecting`);
      });
    }
  });
  require_background();
})();
//# sourceMappingURL=background.js.map
