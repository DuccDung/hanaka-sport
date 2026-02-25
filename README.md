HANAKA-SPORT/
  assets/
    images/
    icons/

  src/
    navigation/
      AppNavigator.js        // Tab navigator (và sau này Stack nếu cần)
      tabConfig.js           // map icon, options chung (tuỳ chọn)

    screens/
      Home/
        HomeScreen.js
        components/
          Header.js
          MenuGrid.js
          BannerCarousel.js
        data/
          menuItems.js
          banners.js
      VideosScreen.js
      ClubScreen.js
      ChatScreen.js
      ContactsScreen.js

    components/
      Placeholder.js         // component dùng chung
      ThemedStatusBar.js     // (tuỳ chọn) status bar dùng chung

    constants/
      colors.js
      spacing.js

    utils/
      // helper functions

  App.js
  index.js
