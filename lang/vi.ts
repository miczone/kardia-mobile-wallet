export const lang: Language = {
  name: 'Tiếng Việt',
  flag: 'VN',
  key: 'vi_VI',
  tag: ['vi_VI', 'VN', 'vi', 'VI', 'vn', 'Tiếng Việt', 'vi_US'],
  dateTimeFormat: 'dd/MM/yyyy HH:mm',
  mapping: {
    // Common key:
    COPIED: 'Sao chép thành công',
    PICKER_TITLE: 'Chọn hình',
    TAKE_PICTURE: 'Chụp hình mới',
    CHOOSE_FROM_LIBRARY: 'Chọn từ thư viện',
    KEEP_IT: 'Giữ lại',
    DELETE_NOW: 'Xoá ngay',
    DONE: 'Hoàn tất',
    BUY_KAI: 'Mua KAI',
    OK_TEXT: 'OK',
    BALANCE: 'Số dư hiện tại',
    STAKED_AMOUNT: 'Số KAI đã đầu tư',
    AGO: 'trước',
    GO_BACK: 'Trở lại',
    CREATE_NEW_WALLET: 'Tạo ví mới',
    IMPORT_WALLET: 'Import ví',
    IMPORT_WALLET_DESCRIPTION:
      'Import ví của bạn để  sử dụng và quản lý KAI và các đồng chạy trên KardiaChain',
    WELCOME: 'Chào mừng đến với Kardia Wallet',
    GETTING_STARTED_DESCRIPTION:
      'Để  bắt đầu, chọn 1 trong các lựa chọn sau đây',
    SUBMIT: 'Xác nhận',
    REQUIRED_FIELD: 'Vui lòng nhập thông tin',
    ADDRESS_NOT_FOUND: 'Không tìm thấy địa chỉ trong danh bạ',
    ADDRESS_EXISTS: 'Địa chỉ đã tồn tại trong danh bạ.',
    COPY_TO_CLIPBOARD: 'Sao chép vào bộ nhớ tạm',
    SECOND: 'giây',
    CONFIRM_IMPORT: 'Bạn chắc chắn muốn thêm ví mới ?',
    RESTART_APP_DESCRIPTION:
      'Kardia Wallet sẽ khởi động lại để đảm bảo các thay đổi được cập nhật.',
    ARE_YOU_SURE: 'Bạn chắc chắn muốn thực hiện thao tác này ?',
    CONFIRM_REMOVE_TITLE: 'Xoá ví',
    CONFIRM_REMOVE_WALLET: 'Bạn có chắc chắn muốn xoá ví khỏi thiết bị ?',
    SAVE: 'Lưu',
    CLOSE: 'Đóng',
    CONFIRM: 'Xác nhận',
    CONFIRM_REMOVE_ADDRESS: 'Bạn chắc chắn muốn xóa địa chỉ này khỏi danh bạ?',
    SCAN_QR_FOR_ADDRESS: 'Địa chỉ ví của bạn',
    SCAN_QR_FOR_ADDRESS_DESCRIPTION: 'Quét mã QR code chứa địa chỉ',
    ERC20_WARNING: 'KHÔNG gửi KAI từ ví ERC20 đến ví này.',
    LATER: 'Để sau',
    SET_APP_PASSCODE: 'Cài đặt mật khẩu',
    NO_PASSCODE: 'Bạn chưa cài mật khẩu cho ví',
    PASSCODE_DESCRIPTION:
      'Mật khẩu ví đảm bảo chỉ có bạn là người sử dụng Kardia Wallet',
    IMPORT_WITH_PRIVATE_KEY: 'Thêm bằng private key',
    IMPORT_WITH_SEED: 'Thêm bằng seed phrase',
    SELECT_ADDRESS: 'Chọn địa chỉ ví',
    NO_SAVED_ADDRESS: '0 địa chỉ',
    NO_SAVED_ADDRESS_SUB_TEXT: 'Hãy bắt đầu giao dịch và lưu địa chỉ giao dịch yêu thích tại đây.',
    ADD_NEW_ADDRESS: 'Thêm địa chỉ ví',
    SAVE_TO_ADDRESS_BOOK: 'Lưu ví',
    INVALID_ADDRESS: 'Địa chỉ không hợp lệ',
    TOKEN_EXISTS: 'Token đã tồn tại',
    // Create wallet key:
    SUBMIT_CREATE: 'Tôi đã hiểu và đã ghi lại. Truy cập ví',
    MNEMONIC_DESCRIPTION:
      '12 từ trên được dùng để  truy cập cũng như khôi phục lại ví của bạn.',
    WALLET_CARD_NAME: 'Tên',
    // Import wallet key:
    ENTER_SEED_PHRASE: 'Nhập chuỗi khóa bí mật',
    ENTER_PRIVATE_KEY: 'Nhập private key',
    SCAN_SEED_PHRASE: 'Quét mã QR chứa chuỗi khóa bí mật',
    SCAN_PRIVATE_KEY: 'Quét mã QR chứa private key',
    WALLET_EXISTED: 'Ví đã tồn tại',
    ERROR_SEED_PHRASE: 'Chuỗi khóa bis mật sai, vui lòng thử lại',
    ERROR_PRIVATE_KEY: 'Private key không hợp lệ, vui lòng kiểm tra lại',
    CONFIRM_ENTER_SEED_PHRASE: 'Bạn đã ghi lại 12 từ khóa bí mật ?',
    SURE: 'Tôi chắc chắn',
    NOT_SURE: 'Trở lại',
    SELECT_YOUR_WALLET: 'Chọn ví muốn import',
    PROCESSING_YOUR_SEED: 'Đang xử lý...',
    BY_PRIVATE_KEY: 'bằng Private Key',
    BY_SEED_PHRASE: 'bằng chuỗi khóa',
    // Transaction key
    RECENT_TRANSACTION: 'Giao dịch gần đây',
    NO_TRANSACTION: 'Không có giao dịch',
    NO_TRANSACTION_SUB_TEXT: 'Có vẻ như chưa có bất kỳ giao dịch nào.',
    SEARCH_TRANSACTION_PLACEHOLDER: 'Tìm kiếm...',
    VIEW_ALL: 'Tất cả',
    SEND: 'Gửi KAI',
    SEND_NOW: 'Gửi ngay',
    CANCEL: 'Hủy',
    RECEIVE: 'Nhận KAI',
    TX_TYPE_RECEIVED: 'Nhận',
    TX_TYPE_SEND: 'Gửi',
    TRANSACTION_HASH: 'Mã giao dịch',
    TRANSACTION_DETAIL: 'Chi tiết',
    TRANSACTION_AMOUNT: 'Số lượng',
    TRANSACTION_FEE: 'Phí giao dịch',
    FROM: 'Ví gửi',
    TO: 'Ví nhận',
    TRANSACTION_DATE: 'Ngày giao dịch',
    CREATE_TX_ADDRESS: 'Địa chỉ ví nhận',
    CREATE_KRC20_TX_ADDRESS: 'Địa chỉ ví nhận',
    CREATE_TX_KAI_AMOUNT: 'Số lượng',
    CREATE_TX_KRC20_AMOUNT: 'Số lượng',
    TRANSACTION_SPEED: 'Chọn độ ưu tiên',
    SLOW_SPEED: 'Chậm',
    AVERAGE_SPEED: 'Trung bình',
    FAST_SPEED: 'Nhanh',
    GAS_PRICE: 'Giá gas',
    GAS_LIMIT: 'Giới hạn gas',
    NEW_CONTACT: 'Địa chỉ mới',
    SPEED_DESCRIPTION:
      '* Thông thường các giao dịch có giá gas cao hơn sẽ được network ưu tiên xử lý trước. Tuy nhiên điều này còn phụ thuộc vào trạng thái của network tại thời điểm giao dịch.',
    CONFIRM_TRANSACTION: 'Xác nhận giao dịch của bạn',
    CONFIRM_KAI_AMOUNT: 'Số lượng',
    NOT_ENOUGH_KAI_FOR_TX: 'Ví không đủ KAI',
    TX_SUCCESS: 'Bạn vừa gửi đến',
    // Wallet key
    IMPORT: 'Thêm ví',
    WALLET: 'Ví',
    ADDRESS: 'Địa chỉ',
    REMOVE_WALLET: 'Xóa ví',
    NEW_WALLET: 'Ví mới',
    // News key
    NEWS_SCREEN_TITLE: 'Tin tức',
    // Staking key
    STAKING_TITLE: 'Đầu tư',
    NO_STAKING: '0 Uỷ quyền',
    NO_STAKING_ITEM: 'Bạn vẫn chưa uỷ quyền (stake) cho bất kỳ ai. Vậy thì còn chờ gì nữa?',
    STAKE_NOW: 'Uỷ quyền (Stake) ngay',
    CLAIMABLE: 'KAI được thưởng',
    STAKED: 'KAI đã stake',
    WITHDRAWABLE: 'KAI có thể rút về ví',
    UNBONDED: 'KAI đang khóa chờ rút',
    CLAIM_REWARD: 'Rút thưởng',
    UNDELEGATE: 'Rút tiền stake',
    WITHDRAW: 'Rút về ví',
    SUCCESS: 'Thành công',
    DELEGATE_SUCCESS: 'Bạn đã đầu tư vào',
    CLAIM_SUCCESS: '{{KAI_AMOUNT}} KAI đã được rút thành công',
    WITHDRAW_SUCCESS: '{{KAI_AMOUNT}} KAI đã được rút về ví',
    UNDELEGATE_SUCCESS:
      'KAI đã được rút. Sau 7 ngày bạn có thể rút số KAI này về ví.',
    UNDELEGATE_AMOUNT_TOO_MUCH: 'Số KAI rút phải nhỏ hơn số KAI đã stake',
    UNDELEGATE_AMOUNT_REMAIN_1000:
      'Cần giữ lại ít nhất 1.000 KAI hoặc rút hết KAI.',
    UNDELEGATE_AMOUNT_PLACEHOLDER: 'Số KAI muốn rút từ stake...',
    YOUR_INVESTMENTS: 'Đầu tư của tôi',
    TOTAL_EARNING: 'Lợi nhuận',
    INVEST: 'Đầu tư',
    CHOOSE_VALIDATOR: 'Chọn người được uỷ quyền (Validator)',
    STAKING_AMOUNT: 'Số KAI đầu tư',
    STAKING_AMOUNT_NOT_ENOUGHT: 'Ví hiện tại không đủ KAI',
    AT_LEAST_MIN_DELEGATE: 'Cần đầu tư ít nhất {{MIN_KAI}} KAI',
    DELEGATE: 'Đầu tư',
    ESTIMATED_EARNING: 'Thu nhập ước tính trong 30 ngày',
    ESTIMATED_APR: 'APR ước tính',
    TOTAL_STAKED_AMOUNT: 'Tổng số KAI đã stake',
    COMMISSION_RATE: 'Hoa hồng',
    VOTING_POWER: 'Quyền biểu quyết',
    VALIDATOR_LIST_TITLE: 'Chọn validator',
    NEW_STAKING_TITLE: 'Stake & Earn',
    SEARCH_VALIDATOR_PLACEHOLDER: 'Tìm theo tên validator ...',
    // Notification Key
    NOTIFICATION_SCREEN_TITLE: 'Thông báo',
    TODAY: 'Hôm nay',
    EARLIER: 'Lịch sử',
    // Setting key
    SETTING_SCREEN_TITLE: 'Cài đặt',
    ADDRESS_BOOK_MENU: 'Danh bạ ví',
    LANGUAGE_MENU: 'Cài đặt ngôn ngữ',
    LANGUAGE_SETTING_TITLE: 'Chọn ngôn ngữ',
    SECRET_PHRASE_MENU: 'Chuỗi khóa bí mật / private key',
    PASSCODE_MENU: 'Cài đặt mật khẩu ví',
    INFO_MENU: 'Về  KardiaChain Wallet',
    MNEMONIC_SETTING_TITLE: 'Chuỗi khóa bí mật / private key',
    SHOW_SECRET_TEXT: 'Hiển thị chuỗi bí mật / private key',
    ADDRESS_NAME: 'Tên hiển thị',
    ADDRESS_ADDRESS: 'Địa chỉ ví',
    PASSCODE_SETTING_TITLE: 'Mật khẩu ví',
    PASSCODE_SETTING_TRIGGER: 'Bật mật khẩu ví',
    CHANGE_PASSCODE: 'Thay đổi mật khẩu ví',
    NEW_PASSCODE: 'Nhập mã PIN',
    CONFIRM_PASSCODE: 'Xác nhận mã PIN',
    CONFIRM_PASSCODE_NOT_MATCH: 'Xác nhận mật khẩu không đúng',
    ENTER_PASSCODE: 'Nhập mã PIN để tíếp tục',
    INCORRECT_PASSCODE: 'Mật khẩu không đúng',
    AVATAR: 'Ảnh đại diện',
    WALLET_MANAGEMENT: 'Quản lý ví',
    GENERAL_GROUP: 'Cài đặt chung',
    SECURITY_GROUP: 'Bảo mật',
    SET_NEW_PIN: 'Nhập PIN mới',
    CONFIRM_PIN: 'Xác nhận PIN',
    WALLET_DETAILS: 'Thông tin ví',
    WALLET_CARD_TYPE: 'Thẻ',
    // Error boundary key
    ERROR_BOUNDARY_TITLE: 'Oops, có lỗi xảy ra.',
    ERROR_BOUNDARY_DESCRIPTION:
      'Chúng tôi rất xin lỗi vì sự bất tiện này. Lỗi đã được gửi cho admin để xử lý',
    NOT_ENOUGH_BALANCE: 'Giao dịch vượt quá số tiền trong ví.',
    GENERAL_ERROR: 'Có lỗi xảy ra, vui lòng thử lại sau',
    // KRC20 key
    KRC20_TOKENS_SECTION_TITLE: 'Token của bạn',
    ADD_TOKEN: 'Thêm token',
    TOKEN_ADDRESS: 'Địa chỉ token',
    SEND_TOKEN: 'Gửi {{TOKEN_SYMBOL}}',
    RECEIVE_TOKEN: 'Nhận {{TOKEN_SYMBOL}}',
    REMOVE_TOKEN: 'Xóa token',
    NO_TOKENS: 'Chưa có tokens',
    NO_TOKENS_SUB_TEXT: 'Thêm và quản lý token dễ dàng.',
    ERROR_FETCH_KRC20_DATA: 'Không lấy được dữ liệu tokens.',
    // Auth modal key
    ENTER_PIN_CODE: 'Nhập mã PIN để tiếp tục',
    WRONG_PIN: 'Mã PIN không đúng',
    // Scan QR screen
    SCAN_QR_TITLE: 'Quét QR code',
    LOAD_MORE_WALLET: 'Xem thêm (+5)',
    INVALID_PHRASE: 'Chuỗi khóa không hợp lệ',
    INVALID_PRIVATE_KEY: 'Private Key không hợp lệ',
    SCAN_QR_MNEMONIC: 'Quét QR code chứa chuỗi từ khoá bí mật để tiếp tục.',
    ENTER_QR_MNEMONIC: 'Nhập 12 từ khoá bí mật, hoặc quét mã QR để tránh sai sót',
    SCAN_QR_PRIVATE_KEY: 'Quét QR code chứa private key để tiếp tục.',
    ENTER_QR_PRIVATE_KEY: 'Nhập private key để tiếp tục, hoặc quét mã QR để tránh sai sót',
    SCAN_MODE: 'Quét QR code',
    INPUT_MODE: 'Nhập thủ công',
    // Tab nav:
    HOME: 'Trang chủ',
    TRANSACTIONS: 'Giao dịch',
    STAKING: 'Đầu tư',
    ADDRESS_BOOK: 'Danh bạ ví',
    SETTING: 'Cài đặt',
    // Walk through screen:
    START_NOW: 'Bắt đầu',
    EASY: 'Đơn giản',
    INSTANT: 'Nhanh chóng',
    SECURE: 'Bảo mật',
    EASY_DESC: 'Tạo và quản lý ví một cách đơn giản và tiện lợi chỉ với vài thao tác.',
    INSTANT_DESC: 'Gửi và nhận tiền điện tử tức thì với chi phí cực thấp.',
    SECURE_DESC: 'Bảo vệ tài sản của bạn bằng những công nghệ tiên tiến nhất.',
  },
};
