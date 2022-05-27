[IPP RFC](https://www.rfc-editor.org/rfc/rfc8011)

# 查詢 uri path 的方法
printer uri 就是類似 `ipp://192.168.1.99:631/ipp/print` 的字串，重點是後面的 path(ex. `/ipp/print`) 是什麼?

可以利用 mDNS-SD 來查出這個 path

### SD
SD ([Service Discovery](https://en.wikipedia.org/wiki/Zero-configuration_networking#DNS-SD)) 的概念就是把一台機器所提供的服務，放進 DNS 的 TXT record 中。如此一來，只要查詢 DNS 就可以知道這台機器的 IP (A record) 及所提供的各種服務 (TXT record)

而 TXT record 裡的 rp 值，就是 print uri 的 path (rp 代表 "The queue name or resource path for the print service ")

> You can use ippfind or dns-sd -Z _ipp._tcp (look at the rp value) to discover your printer's uri. [ref](https://github.com/gmuth/ipp-printjob-kotlin)

> When used in an IPP TXT record, this value indicates the full path of the IPP URL for a particular print queue. The value MUST NOT begin with a slash ("/"). For example, if  "rp=queue123"  is present, the resulting URL for that print queue would be:
> `ipp://<hostname>:<port>/queue123`
> [ref](https://developer.apple.com/bonjour/printing-specification/bonjourprinting-1.2.1.pdf)

註：TXT record 裡的 pdl 欄位好像是這台印表機可以處理的檔案類型，例如 `application/pdf,image/tiff,image/jpeg,...`

### mDNS
mDNS ([Multicast DNS](https://en.wikipedia.org/wiki/Multicast_DNS)) 就是在區網內，透過廣播的方式，讓機器間彼此互相披露及查詢 DNS 所提供的資料，而不需要一台中心的 DNS server

mDNS + SD 就是一種 Zero-configuration networking ([zeroconf](https://en.wikipedia.org/wiki/Zero-configuration_networking)) 的實踐。Apple 的實作是 Apple Bonjour，Linux 則主要是 Avahi，微軟則有 LLMNR

### 工具
* avahi
  * avahi 是 linux 裡對 mDNS-SD 的實作
  * 因為區網內的機器可能隨時增加或移除，所以需要一個 deamon (avahi-deamon) 一直監控這些動態。
  * `avahi-browse -atr` 可以列出所有 dns txt record
    (需要先有 avahi-deamon，但這好像是 linux 預設會先跑的服務)
  * [avahi 筆記](http://pjack1981.blogspot.com/2012/07/avahi.html)
* [mdns-scan](https://github.com/alteholz/mdns-scan)
  不需依賴任何 deamon，但也沒有 TXT record…用處不大
* ippfind
  `ippfind --ls` 這個也是依賴 mDNS-SD，所以需要 Bonjour 或 avahi
  似乎有 windows 版 [ref](https://apple.stackexchange.com/questions/175241/how-can-i-list-the-ip-addresses-of-all-the-airprint-printers-on-a-network)
* wireshark
  windows 在新增印表機時，應該也是應用相同的機制。所以可以透過 wireshark 去監聽那個過程，在 mdns protocol 中可以找到 TXT record

# 注意事項
* ipp uri 通常是
  `http://192.168.1.98/ipp`
  `http://192.168.1.98/ipp/print`
  `http://192.168.1.98/ipp/printer`
  `ipp://192.168.1.99:631/ipp`
  `ipp://192.168.1.99:631/ipp/print`
  `ipp://192.168.1.99:631/ipp/printer`
* 底層所使用的 ipp module 不支援 ipps (ipp over ssl)
  所以 `ipps://192.168.1.99:443/ipp/print` 是不行的

# 指定紙匣
[解法1](https://stackoverflow.com/questions/44144159/cannot-print-on-another-paper-tray-via-ipp) 說直接在 job template 的 media 裡指定 input tray 名稱即可，但他依據的是舊的 rfc 2566，[最新版 RFC 8011](https://www.rfc-editor.org/rfc/rfc8011#section-5.2.11) 並不建議這麼作

8011 建議 media 裡只填 medium size (ex. iso_a4_210x297mm)。而用 media-col 欄位來作比較精確的比對 (但 media-col 不是每個印表機都支援)

> Note: If supported by the Printer, Clients MAY use the alternative "media-col" attribute [PWG5100.3] [PWG5100.13] to specify medium requirements in greater detail.

> The client MUST NOT supply both the "media" and the "media-col" Job Template attributes in a Job Creation request [PWG5100.3]

williamkapke (ipp module 的作者) 就是使用 media-col [ref](https://github.com/williamkapke/ipp/issues/46)
但是他只指定紙匣名稱 ("media-source": "tray-2")，這個方式對固定紙匣管用，但是送到 by-pass-tray 時紙張大小會跑掉
所以最好加上對 media-size 的指定

```
'job-attributes-tag':{
  'media-col': {
    'media-source': 'by-pass-tray',                              // or tray-1
    'media-size': { 'x-dimension': 14800, 'y-dimension': 21000 },
  },
},
```

注意事項:
1. 這裡的 media 或 media-col 都不是用來"指定"某些列印參數，而是用來"選擇比對"所需用到的紙匣 ([PWG5100.3] 3.13)
   利用 media-col 來比對紙匣時，client 端不需提供所有的參數，印表機會有演算法來找出符合指定條件的紙匣
2. media-col 裡的參數，只有 media-size 是印表機一定會支援的!!
   所以實際可送的參數要先檢查印表機設定 (Get-Printer-Attributes)

###  media-ready 及 media-col-ready
這三個屬性是 printer attribute 裡面的，印表機不一定有支援
media-ready 是 media-supported 的子集。ready 代表紙匣有紙，不需要人工介入就立即可用的紙匣
所以當紙匣沒紙時，media-ready 及 media-col-ready 的數量就會減少
media-ready 與 media-col-ready 一定是互相對應的。media-ready 的第一個元素，就對應 media-col-ready 的第一個元素

ref [PWG5100.3] 3.13.13


[PWG5100.3]: http://ftp.pwg.org/pub/pwg/candidates/cs-ippprodprint10-20010212-5100.3.pdf
