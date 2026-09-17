import type { ToolEntry } from '@/types';
import { tools } from '@/data/tools';

// Text tools
import { WordCounter, CaseConverter, LoremIpsumGenerator, TextToSlug, RemoveLineBreaks, TextRepeater, TextSorter, CommaSeparator, RandomWordGenerator } from '@/tools/TextTools';
// Legal tools
import { PrivacyPolicyGenerator, TermsAndConditionGenerator, DisclaimerGenerator } from '@/tools/LegalTools';
// Dev tools
import { JSONFormatter, JSONMinify, JSONValidator, JSONToXML, JSONToCSV, Base64Encode, Base64Decode, URLEncode, URLDecode, HTMLEncode, HTMLDecode, UUIDGenerator, URLParser, MD5Generator } from '@/tools/DevTools';
import { JSONViewer, JSONEditor, JSONToText, JSONToTSV, XMLToJSON, CSVToJSON, TSVToJSON, UTMBuilder, GetSourceCode } from '@/tools/MoreDevTools';
// Code tools
import { HTMLBeautifier, HTMLMinifier, CSSBeautifier, CSSMinifier, JavaScriptBeautifier, JavaScriptMinifier, JavaScriptObfuscator, JavaScriptDeObfuscator } from '@/tools/CodeTools';
// Binary tools
import { TextToBinary, BinaryToText, ASCIIToBinary, BinaryToASCII, TextToASCII, ASCIIToText, DecimalToBinary, BinaryToDecimal, HexToBinary, BinaryToHex, DecimalToHex, HexToDecimal, TextToHex, HexToText, OctalToDecimal, DecimalToOctal, OctalToBinary, BinaryToOctal, HexToOctal, OctalToHex, TextToOctal, OctalToText, TextToDecimal, DecimalToText } from '@/tools/BinaryTools';
// Converter tools
import { LengthConverter, WeightConverter, TemperatureConverter, AreaConverter, VolumeConverter, SpeedConverter, DigitalConverter, TimeConverter, PressureConverter, PowerConverter, EnergyConverter, FrequencyConverter, AngleConverter, CurrentConverter, VoltageConverter, PaceConverter, EachConverter, PartsPerConverter, ReactivePowerConverter, ApparentPowerConverter, ReactiveEnergyConverter, VolumetricFlowRateConverter, IlluminanceConverter, TorqueConverter, ChargeConverter, CurrencyConverter } from '@/tools/ConverterTools';
// Calculator tools
import { AgeCalculator, PercentageCalculator, LoanCalculator, DiscountCalculator, GSTCalculator, AverageCalculator } from '@/tools/CalculatorTools';
import { SalesTaxCalculator, MarginCalculator, ProbabilityCalculator, PayPalFeeCalculator, CPMCalculator, ConfidenceIntervalCalculator, NumberToWordConverter, WordToNumberConverter, NumberToRomanNumerals, RomanNumeralsToNumber } from '@/tools/MoreCalculatorTools';
import { BKashChargeCalculator, NagadChargeCalculator, RocketChargeCalculator } from '@/tools/BangladeshiCalculatorTools';
// Utility tools
import { PasswordGenerator, QRCodeGenerator, ColorConverter, HexToRgb, RgbToHex, WhatIsMyIP, IPAddressLookup } from '@/tools/UtilityTools';
import { FakeAddressGenerator, FindFacebookID, QRCodeDecoder } from '@/tools/MoreWebTools';
// Image tools
import { ImageToBase64, Base64ToImage } from '@/tools/ImageTools';
import { ImageConverter, JPGToPNG, PNGToJPG, WebPToJPG, PNGToWebP, JPGToWebP, WebPToPNG, PNGToBMP, PNGToGIF, PNGToICO, JPGToBMP, JPGToGIF, JPGToICO, ICOToPNG, ICOConverter, JPGConverter, FlipImage, RotateImage, ImageEnlarger, ImageCropper, ImageResizer } from '@/tools/ImageEditTools';
// Web tools
import { WhatIsMyBrowser, WhatIsMyUserAgent, WhatIsMyScreenResolution, WebsiteStatusChecker } from '@/tools/WebTools';
import { WordPressPasswordGenerator, HTAccessRedirectGenerator, WebsiteSEOScoreChecker, OnlinePingWebsiteTool, WebsiteSpeedChecker, PageSizeChecker, OpenMultipleURLs } from '@/tools/MoreWebTools';
// Other tools
import { SRTToVTT, VTTToSRT, YouTubeThumbnailDownloader } from '@/tools/OtherTools';
import { BDNumberLookup } from '@/tools/NumberLookupTools';
import { RemoveDuplicateLines, FindAndReplace, ReverseText, TextToSpeech, TextCompare } from '@/tools/MoreTextTools';
import { MarkdownToHTML, BoxShadowGenerator, MetaTagGenerator, RobotsTxtGenerator, RegexTester, SHA256Generator, HTTPStatusCodeReference, JWTDecoder } from '@/tools/AdvancedDevTools';
import { PasswordStrengthAnalyzer, HashIdentifier } from '@/tools/HashSecurityTools';
import { SubnetCalculator, MACVendorLookup, PortReference } from '@/tools/NetworkSecurityTools';
import { SecurityHeadersChecker, WordlistGenerator } from '@/tools/EthicalSecurityTools';
import { CaesarCipher, VigenereCipher, ROT13Converter, Base32Encode, Base32Decode } from '@/tools/CipherTools';
import { XSSPayloadReference, SQLiPayloadReference, HTTPHeaderInjector } from '@/tools/PayloadReferenceTools';
import { DNSLookupTool, HTTPMethodChecker, CORSTester, SSLInfoChecker, HTTPHeaderAnalyzer, SecurityChecklist } from '@/tools/EthicalHackingTools';
import { AIPromptGenerator, TextSummarizer, HashtagGenerator, WordFrequencyAnalyzer } from '@/tools/AITools';
import { TipCalculator, BMICalculator, PomodoroTimer, UnitPriceCalculator, DecisionMaker } from '@/tools/LifestyleTools';
import { PDFTextExtractor } from '@/tools/PDFTools';
import { BINChecker, CCTestGenerator, TempMailInfo, WhatIsMyOS, WhatIsMyScreenResolutionEnhanced, WebsiteSourceViewer, PasswordStrengthChecker, HTTPStatusReference, SSLCertificateChecker, HTAccessRedirectGeneratorEnhanced, WordPressPasswordGeneratorEnhanced } from '@/tools/TeamCSBTools';
import { PDFMetadataViewer, PDFPageCounter, PDFInfo, PDFCompressorInfo, PDFMergerInfo, PDFToImageInfo } from '@/tools/MorePDFTools';
import { YAMLToJSON, JSONToYAML, MorseCodeConverter, OGTagGenerator, SitemapGenerator, GradientGenerator, FaviconGeneratorInfo, NumberToWordsMulti, URLShortenerInfo, MultiHashGenerator, ColorPickerInfo, JSONToProperties } from '@/tools/ExtraTools';
import { BINFinder, BINShare, CreditCardGenerator, LiveCCCheckerInfo, QRCodeScannerInfo, WhoisLookupInfo, DNSLookupInfo, ReverseDNSInfo, IPGeolocationInfo, EmailValidatorInfo, PDFToWordInfo, PDFToExcelInfo, ImageCompressorInfo, VideoConverterInfo, AudioConverterInfo, PasswordManagerInfo, VPNServiceInfo, CloudStorageInfo, CodeFormatterInfo, APITestingInfo, SEOToolsInfo, SSLCertificateInfo, WebsiteBuilderInfo, LearningResourcesInfo, BackgroundRemoverInfo } from '@/tools/MoreTeamCSBTools';
import { SentimentAnalyzer, GrammarChecker, ContentIdeaGenerator, SEOMetaGenerator, TextRephraser, AIToolsDirectoryInfo } from '@/tools/MoreAITools';

const componentMap: Record<string, React.ComponentType> = {
  // Text
  'word-counter': WordCounter,
  'case-converter': CaseConverter,
  'lorem-ipsum-generator': LoremIpsumGenerator,
  'text-to-slug': TextToSlug,
  'remove-line-breaks': RemoveLineBreaks,
  'text-repeater': TextRepeater,
  'text-sorter': TextSorter,
  'comma-separator': CommaSeparator,
  'random-word-generator': RandomWordGenerator,
  // Legal
  'privacy-policy-generator': PrivacyPolicyGenerator,
  'terms-and-condition-generator': TermsAndConditionGenerator,
  'disclaimer-generator': DisclaimerGenerator,
  // Dev
  'json-formatter': JSONFormatter,
  'json-minify': JSONMinify,
  'json-validator': JSONValidator,
  'json-viewer': JSONViewer,
  'json-editor': JSONEditor,
  'json-to-xml': JSONToXML,
  'json-to-csv': JSONToCSV,
  'json-to-text': JSONToText,
  'json-to-tsv': JSONToTSV,
  'xml-to-json': XMLToJSON,
  'csv-to-json': CSVToJSON,
  'tsv-to-json': TSVToJSON,
  'base64-encode': Base64Encode,
  'base64-decode': Base64Decode,
  'url-encode': URLEncode,
  'url-decode': URLDecode,
  'html-encode': HTMLEncode,
  'html-decode': HTMLDecode,
  'uuid-generator': UUIDGenerator,
  'url-parser': URLParser,
  'md5-generator': MD5Generator,
  'utm-builder': UTMBuilder,
  'get-source-code-of-webpage': GetSourceCode,
  // Code
  'html-beautifier': HTMLBeautifier,
  'html-minifier': HTMLMinifier,
  'css-beautifier': CSSBeautifier,
  'css-minifier': CSSMinifier,
  'javascript-beautifier': JavaScriptBeautifier,
  'javascript-minifier': JavaScriptMinifier,
  'javascript-obfuscator': JavaScriptObfuscator,
  'javascript-deobfuscator': JavaScriptDeObfuscator,
  // Binary
  'text-to-binary': TextToBinary,
  'binary-to-text': BinaryToText,
  'ascii-to-binary': ASCIIToBinary,
  'binary-to-ascii': BinaryToASCII,
  'text-to-ascii': TextToASCII,
  'ascii-to-text': ASCIIToText,
  'decimal-to-binary': DecimalToBinary,
  'binary-to-decimal': BinaryToDecimal,
  'hex-to-binary': HexToBinary,
  'binary-to-hex': BinaryToHex,
  'decimal-to-hex': DecimalToHex,
  'hex-to-decimal': HexToDecimal,
  'text-to-hex': TextToHex,
  'hex-to-text': HexToText,
  'octal-to-decimal': OctalToDecimal,
  'decimal-to-octal': DecimalToOctal,
  'octal-to-binary': OctalToBinary,
  'binary-to-octal': BinaryToOctal,
  'hex-to-octal': HexToOctal,
  'octal-to-hex': OctalToHex,
  'text-to-octal': TextToOctal,
  'octal-to-text': OctalToText,
  'text-to-decimal': TextToDecimal,
  'decimal-to-text': DecimalToText,
  // Converters
  'length-converter': LengthConverter,
  'weight-converter': WeightConverter,
  'temperature-converter': TemperatureConverter,
  'area-converter': AreaConverter,
  'volume-converter': VolumeConverter,
  'speed-converter': SpeedConverter,
  'digital-converter': DigitalConverter,
  'time-converter': TimeConverter,
  'pressure-converter': PressureConverter,
  'power-converter': PowerConverter,
  'energy-converter': EnergyConverter,
  'frequency-converter': FrequencyConverter,
  'angle-converter': AngleConverter,
  'current-converter': CurrentConverter,
  'voltage-converter': VoltageConverter,
  'pace-converter': PaceConverter,
  'each-converter': EachConverter,
  'parts-per-converter': PartsPerConverter,
  'reactive-power-converter': ReactivePowerConverter,
  'apparent-power-converter': ApparentPowerConverter,
  'reactive-energy-converter': ReactiveEnergyConverter,
  'volumetric-flow-rate-converter': VolumetricFlowRateConverter,
  'illuminance-converter': IlluminanceConverter,
  'torque-converter': TorqueConverter,
  'charge-converter': ChargeConverter,
  'currency-converter': CurrencyConverter,
  // Calculators
  'age-calculator': AgeCalculator,
  'percentage-calculator': PercentageCalculator,
  'loan-calculator': LoanCalculator,
  'discount-calculator': DiscountCalculator,
  'gst-calculator': GSTCalculator,
  'average-calculator': AverageCalculator,
  'number-to-words': NumberToWordConverter,
  'number-to-word-converter': NumberToWordConverter,
  'word-to-number': WordToNumberConverter,
  'word-to-number-converter': WordToNumberConverter,
  'roman-numerals': NumberToRomanNumerals,
  'number-to-roman-numerals': NumberToRomanNumerals,
  'roman-numerals-to-number': RomanNumeralsToNumber,
  'sales-tax-calculator': SalesTaxCalculator,
  'margin-calculator': MarginCalculator,
  'probability-calculator': ProbabilityCalculator,
  'paypal-fee-calculator': PayPalFeeCalculator,
  'cpm-calculator': CPMCalculator,
  'confidence-interval-calculator': ConfidenceIntervalCalculator,
  'bkash-charge-calculator': BKashChargeCalculator,
  'nagad-charge-calculator': NagadChargeCalculator,
  'rocket-charge-calculator': RocketChargeCalculator,
  // Utility
  'password-generator': PasswordGenerator,
  'qr-code-generator': QRCodeGenerator,
  'color-converter': ColorConverter,
  'hex-to-rgb': HexToRgb,
  'rgb-to-hex': RgbToHex,
  'what-is-my-ip': WhatIsMyIP,
  'ip-address-lookup': IPAddressLookup,
  'fake-address-generator': FakeAddressGenerator,
  'find-facebook-id': FindFacebookID,
  'qr-code-decoder': QRCodeDecoder,
  // Image
  'image-to-base64': ImageToBase64,
  'base64-to-image': Base64ToImage,
  'flip-image': FlipImage,
  'rotate-image': RotateImage,
  'image-enlarger': ImageEnlarger,
  'image-cropper': ImageCropper,
  'image-resizer': ImageResizer,
  'image-converter': ImageConverter,
  'jpg-to-png': JPGToPNG,
  'png-to-jpg': PNGToJPG,
  'jpg-converter': JPGConverter,
  'webp-to-jpg': WebPToJPG,
  'png-to-webp': PNGToWebP,
  'png-to-bmp': PNGToBMP,
  'png-to-gif': PNGToGIF,
  'png-to-ico': PNGToICO,
  'jpg-to-webp': JPGToWebP,
  'jpg-to-bmp': JPGToBMP,
  'jpg-to-gif': JPGToGIF,
  'jpg-to-ico': JPGToICO,
  'webp-to-png': WebPToPNG,
  'ico-to-png': ICOToPNG,
  'ico-converter': ICOConverter,
  // Web
  'what-is-my-browser': WhatIsMyBrowser,
  'what-is-my-user-agent': WhatIsMyUserAgent,
  'what-is-my-screen-resolution': WhatIsMyScreenResolution,
  'website-status-checker': WebsiteStatusChecker,
  'wordpress-password-generator': WordPressPasswordGenerator,
  'htaccess-redirect-generator': HTAccessRedirectGenerator,
  'website-seo-score-checker': WebsiteSEOScoreChecker,
  'online-ping-website-tool': OnlinePingWebsiteTool,
  'website-speed-checker': WebsiteSpeedChecker,
  'page-size-checker': PageSizeChecker,
  'open-multiple-urls': OpenMultipleURLs,
  // Other
  'srt-to-vtt': SRTToVTT,
  'vtt-to-srt': VTTToSRT,
  'youtube-thumbnail-downloader': YouTubeThumbnailDownloader,
  'bd-number-lookup': BDNumberLookup,
  // Security & Ethical Hacking
  'dns-lookup': DNSLookupTool,
  'cors-tester': CORSTester,
  'http-method-checker': HTTPMethodChecker,
  'ssl-info-checker': SSLInfoChecker,
  'http-header-analyzer': HTTPHeaderAnalyzer,
  'security-checklist': SecurityChecklist,
  'password-strength-analyzer': PasswordStrengthAnalyzer,
  'hash-identifier': HashIdentifier,
  'subnet-calculator': SubnetCalculator,
  'mac-vendor-lookup': MACVendorLookup,
  'security-headers-checker': SecurityHeadersChecker,
  'port-reference': PortReference,
  'wordlist-generator': WordlistGenerator,
  'caesar-cipher': CaesarCipher,
  'vigenere-cipher': VigenereCipher,
  'rot13-converter': ROT13Converter,
  'base32-encode': Base32Encode,
  'base32-decode': Base32Decode,
  'xss-payload-reference': XSSPayloadReference,
  'sqli-payload-reference': SQLiPayloadReference,
  'http-header-injector': HTTPHeaderInjector,
  // Additional Text
  'remove-duplicate-lines': RemoveDuplicateLines,
  'find-and-replace': FindAndReplace,
  'reverse-text': ReverseText,
  'text-to-speech': TextToSpeech,
  'text-compare': TextCompare,
  // Additional Dev
  'markdown-to-html': MarkdownToHTML,
  'css-box-shadow-generator': BoxShadowGenerator,
  'meta-tag-generator': MetaTagGenerator,
  'robots-txt-generator': RobotsTxtGenerator,
  'regex-tester': RegexTester,
  'sha256-generator': SHA256Generator,
  'http-status-code-reference': HTTPStatusCodeReference,
  'jwt-decoder': JWTDecoder,
  // AI & Productivity
  'ai-prompt-generator': AIPromptGenerator,
  'text-summarizer': TextSummarizer,
  'hashtag-generator': HashtagGenerator,
  'word-frequency-analyzer': WordFrequencyAnalyzer,
  'pomodoro-timer': PomodoroTimer,
  // Lifestyle & Everyday
  'tip-calculator': TipCalculator,
  'bmi-calculator': BMICalculator,
  'unit-price-calculator': UnitPriceCalculator,
  'decision-maker': DecisionMaker,
  // PDF
  'pdf-text-extractor': PDFTextExtractor,
  // TeamXD Tools
  'bin-checker': BINChecker,
  'cc-test-generator': CCTestGenerator,
  'temp-mail': TempMailInfo,
  'what-is-my-os': WhatIsMyOS,
  'what-is-my-screen-resolution-enhanced': WhatIsMyScreenResolutionEnhanced,
  'website-source-viewer': WebsiteSourceViewer,
  'password-strength-checker': PasswordStrengthChecker,
  'http-status-reference': HTTPStatusReference,
  'ssl-certificate-checker': SSLCertificateChecker,
  'htaccess-redirect-generator-enhanced': HTAccessRedirectGeneratorEnhanced,
  'wordpress-password-generator-enhanced': WordPressPasswordGeneratorEnhanced,
  // More PDF Tools
  'pdf-metadata-viewer': PDFMetadataViewer,
  'pdf-page-counter': PDFPageCounter,
  'pdf-info': PDFInfo,
  'pdf-compressor-info': PDFCompressorInfo,
  'pdf-merger-info': PDFMergerInfo,
  'pdf-to-image-info': PDFToImageInfo,
  // Extra Tools
  'yaml-to-json': YAMLToJSON,
  'json-to-yaml': JSONToYAML,
  'morse-code-converter': MorseCodeConverter,
  'og-tag-generator': OGTagGenerator,
  'sitemap-generator': SitemapGenerator,
  'gradient-generator': GradientGenerator,
  'favicon-generator-info': FaviconGeneratorInfo,
  'number-to-words-multi': NumberToWordsMulti,
  'url-shortener-info': URLShortenerInfo,
  'multi-hash-generator': MultiHashGenerator,
  'color-picker-info': ColorPickerInfo,
  'json-to-properties': JSONToProperties,
  // More TeamXD Tools
  'bin-finder': BINFinder,
  'bin-share': BINShare,
  'credit-card-generator': CreditCardGenerator,
  'live-cc-checker-info': LiveCCCheckerInfo,
  'qr-code-scanner-info': QRCodeScannerInfo,
  'whois-lookup-info': WhoisLookupInfo,
  'dns-lookup-info': DNSLookupInfo,
  'reverse-dns-info': ReverseDNSInfo,
  'ip-geolocation-info': IPGeolocationInfo,
  'email-validator-info': EmailValidatorInfo,
  'pdf-to-word-info': PDFToWordInfo,
  'pdf-to-excel-info': PDFToExcelInfo,
  'image-compressor-info': ImageCompressorInfo,
  'video-converter-info': VideoConverterInfo,
  'audio-converter-info': AudioConverterInfo,
  'password-manager-info': PasswordManagerInfo,
  'vpn-service-info': VPNServiceInfo,
  'cloud-storage-info': CloudStorageInfo,
  'code-formatter-info': CodeFormatterInfo,
  'api-testing-info': APITestingInfo,
  'seo-tools-info': SEOToolsInfo,
  'ssl-certificate-info': SSLCertificateInfo,
  'website-builder-info': WebsiteBuilderInfo,
  'learning-resources-info': LearningResourcesInfo,
  'background-remover-info': BackgroundRemoverInfo,
  // More AI Tools
  'sentiment-analyzer': SentimentAnalyzer,
  'grammar-checker': GrammarChecker,
  'content-idea-generator': ContentIdeaGenerator,
  'seo-meta-generator': SEOMetaGenerator,
  'text-rephraser': TextRephraser,
  'ai-tools-directory': AIToolsDirectoryInfo,
};

export const toolEntries: ToolEntry[] = tools.map((t) => ({
  ...t,
  component: componentMap[t.slug],
}));

export function getToolBySlug(slug: string): ToolEntry | undefined {
  return toolEntries.find((t) => t.slug === slug);
}
