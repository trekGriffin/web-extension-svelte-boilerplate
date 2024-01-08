<script  >
  import { onMount } from 'svelte';
  import {getCurrentDateTime} from '../../lib/trek'
  var proxy_status = 'direct';

  let logText = [];
  var proxy_server = '';
  let bypassList  = ["192.168.1.1/16,localhost,*example.com*"];
  let singleBypass = '';
  onMount(() => {
    try {
      //get proxy settings
      chrome.proxy.settings.get({}, (config) => {
        proxy_status = config.value.mode;
        chrome.storage.local.get('proxy').then((json) => {
          proxy_server = json.proxy;
        });
      });
      //get value for bypass list
      chrome.storage.local.get('list').then((json) => {
        bypassList = [...json.list.split(','),...bypassList];
      });
    } catch (e) {
      log('get proxy status error');
    }
  });

  function _setProxy() {
    log('setting proxy ' + proxy_server);
    var arr = proxy_server.split(':');
    var host = arr[0];
    var port = arr[1];
    try{
        chrome.proxy.settings.set(
      {
        value: {
          mode: 'fixed_servers',
          rules: {
            singleProxy: {
              host: host,
              port: parseInt(port),
            },
            bypassList: bypassList,
          },
           
        },
        scope: 'regular',
      },
      () => {
        proxy_status = 'proxy_server';
        log('set proxy ok');
      }
    );
    }catch(e){
        err("set proxy err "+e)
    }
    
  }

  function setProxy() {
    if (proxy_server == '') {
      log('empty server...');
      return;
    }
    //save proxy
    try {
      chrome.storage.local
        .set({ proxy: proxy_server, list: bypassList.join(',') })
        .then(() => {
          _setProxy();
         
        })
        .catch((e) => {
          err('set local storage' + e);
        });
    } catch (e) {
      err('set proxy error '+e);
    }
  }

  function removeList(s) {
    bypassList = bypassList.filter((ele) => ele != s);
    setProxy();
  }
  function addList() {
    bypassList=[singleBypass,...bypassList];
    setProxy();
  }
  function log(s) {
    logText = [getCurrentDateTime() + ' ' + s, ...logText];
  }
  function err(s) {
    log('[err] ' + s);
  }
  function debug(s) {
    log('[debug] ' + s);
  }
  function refreshUI() {
    try {
      chrome.proxy.settings.get({}, (config) => {
        log(`${JSON.stringify(config.value)}`);
        proxy_status= config.value.mode;
      });
    }catch (e) {
      err('get proxe setting error' + e);
    }
  }
  function cancelProxy() {
    try {
      chrome.proxy.settings.set(
        {
          value: {
            mode: 'direct',
          },
          scope: 'regular',
        },
        () => {
          log('proxy cleared');
          refreshUI();
        }
      );
    } catch (e) {
      err('cancel proxy error'+e);
    }
  }
   
</script>

<div class="body">
  <p class="innerText"><span >proxy status:</span> {proxy_status}</p>
  <p>input your proxy server:</p>
  <input bind:value={proxy_server} placeholder="proxy.domain.com:1234" />
  <button on:click={setProxy} class="btn">set proxy</button>
  <br />
  <button on:click={cancelProxy}>cancel proxy</button>
  <br />
  <button on:click={refreshUI}>checkSetting</button>

  
  <hr />
  <h3>bypassList(support wildcard)</h3>
  <input bind:value={singleBypass} />
  <button on:click={addList}>add</button>
  {#each bypassList as s}
    <p>
      {s}
      <button
        on:click={() => {
          removeList(s);
        }}>del</button
      >
    </p>
  {/each}

  <hr />
  <h3>log</h3>
  <button
    on:click={() => {
      logText = [];
    }}>clear log</button
  >
  <div class="log">
    {#each logText as s}
      <p>{s}</p>
    {/each}
  </div>
</div>

<style>
    .body{
        padding: 10px;
    }
  .log {
    width: 100%;
    overflow: auto;
  }
  .innerText{
    font-size:35px;
  }
  .innerText span{
    font-size:12px;

  }
  button {
  display: inline-block;
  padding: 3px 5px;
  font-size: 16px;
  margin: 2px;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s ease-in-out;
}
</style>
