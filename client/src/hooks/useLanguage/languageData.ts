import { LangaugeData, lng } from './types';

const LANGUAGE_DATA: LangaugeData = {
  en: {
    [lng.email]: 'Email',
    [lng.emailHint]: 'Please enter a valid email address',
    [lng.emoji]: 'Emoji',
    [lng.password]: 'Password',
    [lng.passwordHint]: 'Please enter your password',
    [lng.register]: 'Register',
    [lng.login]: 'Log in',
    [lng.loginWelcome]: 'Log in',
    [lng.loginSuccess]: 'You have been successfully logged in',
    [lng.loginError]: 'Wrong email or password. Try again!',

    [lng.nickname]: 'Nickname',
    [lng.nicknameHint]: 'At least 3 characters long',
    [lng.repeatPassword]: 'Repeat password',
    [lng.repeatPasswordHint]: 'The passwords should match',

    [lng.registerWelcome]: 'New account',
    [lng.registerSuccess]: 'You have been registered',
    [lng.registerError]: 'Regisration error. Try again later!',

    [lng.languageSelect]: 'App language',
    [lng.darkMode]: 'Dark mode',
    [lng.lightMode]: 'Light mode',
    [lng.userMessages]: 'Messages',
    [lng.userPosts]: 'All Posts',
    [lng.userAddPost]: 'Create new post',
    [lng.userNotFound]: 'The user with the id of % was not found. ',

    [lng.settings]: 'Settings',
    [lng.logout]: 'Log out',

    [lng.uploadPhoto]: 'Upload a photo',
    [lng.changePhoto]: 'Change photo',
    [lng.deletePhoto]: 'Delete photo',
    [lng.chooseAvatar]: 'Choose your avatar photo',
    [lng.chooseDefault]: 'or select from the list',

    [lng.age]: 'Age',
    [lng.ageHint]: 'Age must be between 0 and 99 years',
    [lng.country]: 'Country',
    [lng.countryHint]: 'At least 3 characters long',
    [lng.city]: 'City',
    [lng.cityHint]: 'At least 3 characters long',
    [lng.firstName]: 'First name',
    [lng.firstNameHint]: 'At least 3 characters long',
    [lng.lastName]: 'Last name',
    [lng.lastNameHint]: 'At least 3 characters long',
    [lng.newPassword]: 'New password',

    [lng.update]: 'Update',
    [lng.notFound]: 'The page you are looking for was not found',
    [lng.goToHome]: 'Go to homepage',

    [lng.dangerZone]: 'Danger zone',
    [lng.giveUpAdmin]: 'Give up admin rights',
    [lng.giveUpAdminMsg]:
      'Are you sure you want to give up your admin rights? This cannot be undone.',
    [lng.deleteAccount]: 'Delete account',
    [lng.deleteAccountMsg]: 'Are you sure you want to delete your account? This cannot be undone.',
    [lng.deleteAccountOtherMsg]: `Are you sure you want to delete this user's account? This cannot be undone.`,
    [lng.upgradeRole]: 'Upgrade role',
    [lng.upgradeRoleMsg]: `Are you sure you want to upgrade this user's rights? This cannot be undone.`,

    [lng.confirm]: 'Confirm',
    [lng.cancel]: 'Cancel',
    [lng.save]: 'Save',
    [lng.close]: 'Close',
    [lng.collapse]: 'Collapse',
    [lng.expand]: 'Expand',
    [lng.clear]: 'Clear',
    [lng.fullScreen]: 'Fullscreen mode',
    [lng.fullScreenExit]: 'Exit fullscreen mode',

    [lng.searchPlaceholder]: 'Search users...',
    [lng.searchWelcome]: 'Start typing to look for users...',
    [lng.searchNotFound]: 'Users were not found for this input (%)',

    [lng.admin]: 'admin',
    [lng.online]: 'Online',
    [lng.offline]: 'Offline',
    [lng.onlineAndMore]: 'and % more',
    [lng.chat]: '??hat',

    [lng.newPostTitle]: 'New post',
    [lng.editPostTitle]: 'Edit post',
    [lng.postTitle]: 'Heading',
    [lng.postTitleHint]: 'Please add post heading',
    [lng.postBody]: 'Post body',
    [lng.postBodyHint]: 'Please add post body',
    [lng.postUploadMedia]: 'Upload media',
    [lng.postUploadMediaDelete]: 'Delete media',

    [lng.postDelete]: 'Delete post',
    [lng.postDeleteMsg]: 'Are you sure you want to delete this post? This cannot be undone.',
    [lng.postEdit]: 'Edit post',
    [lng.postCopyLink]: 'Copy post link',
    [lng.postCopyLinkSuccess]: 'The link was copied to clipboard (%)',
    [lng.postOpen]: 'Open post page',
    [lng.postNotFound]: 'The post with the id of % was not found.',
    [lng.postTitleMsg]: 'Posts',
    [lng.postGuestUser]: `The user doesn't have any posts yet. You can get in touch with them by clicking on the Chat button.`,
    [lng.postSelfUser]: `You don't have any posts yet. Click the button below to add the first one.`,
    [lng.postsAllTitle]: 'All Posts',
    [lng.postsAllNoneMsg]: `No posts have been found on the server. Create your first one by selecting the option from the header menu or from the user page.`,

    [lng.commentWrite]: 'Write your comment here...',
    [lng.commentPublish]: 'Send',
    [lng.commentEdit]: 'Edit comment',
    [lng.commentDelete]: 'Delete comment',
    [lng.commentsHeading]: 'Comments',
    [lng.commentsNoneMsg]: 'No comments were added for this post. Write the first one!',

    [lng.justNow]: 'just now',
    [lng.yesterday]: 'yesterday',
    [lng.ago]: 'ago',
    [lng.minutes1]: 'minute',
    [lng.minutes2]: 'minutes',
    [lng.minutes3]: 'minutes',
    [lng.hours1]: 'hour',
    [lng.hours2]: 'hours',
    [lng.hours3]: 'hours',

    [lng.recording]: 'Recording',
    [lng.recordingStart]: 'Start recording',
    [lng.recordingStop]: 'Stop recording',
    [lng.recordingAccessing]: 'Accessing devices...',
    [lng.recordingVideo]: 'Record video',
    [lng.recordingAudio]: 'Record audio',

    [lng.loadingMsg]: 'Loading...',

    [lng.messagesHeading]: 'Conversations',
    [lng.messagesNoneMsg]:
      'Conversations are empty. Please use user search in the header and start a new conversation.',
    [lng.messagesLastMsg]: 'Last message',
    [lng.messagesUnread]: 'Unread',
    [lng.messagesClickToChat]: 'Click to chat',
    [lng.messageIsRead]: 'Message was read',

    [lng.chats]: 'Chats',
    [lng.chatWith]: 'Chat with',
    [lng.chatWrote]: 'wrote',
    [lng.chatsInputEmpty]: 'Message',
    [lng.chatWriteMessage]: 'Write message',

    [lng.formatBold]: 'Bold',
    [lng.formatItalic]: 'Italic',
    [lng.formatUnderline]: 'Underline',
    [lng.formatTitle]: 'Heading',
    [lng.formatBulletedList]: 'Bulleted List',
    [lng.formatNumberedList]: 'Numbered List',
    [lng.formatCode]: 'Code',
    [lng.formatHighlight]: 'Highlight',
    [lng.formatAddLink]: 'Add link',
    [lng.formatModifyLink]: 'Modify link',
    [lng.formatEditLinkTitle]: 'Edit Link',
    [lng.formatEditLinkMsg]: 'Please provide hyperlink address:',
    [lng.formatLinkAddress]: 'Address',

    [lng.likeFirst]: 'Be the first to like',
    [lng.you]: 'You',
  },

  ru: {
    [lng.email]: '?????????????????????? ??????????',
    [lng.emailHint]: '?????????????? ???????????????? ??????????',
    [lng.emoji]: '????????????',
    [lng.password]: '????????????',
    [lng.passwordHint]: '?????????????????????? ?????????? ???????????? - 8 ????????????????',
    [lng.register]: '??????????????????????',
    [lng.login]: '??????????',
    [lng.loginWelcome]: '????????',
    [lng.loginSuccess]: '???? ?????????????? ??????????!',
    [lng.loginError]: '???????????????????????? ?????????? ?????????????????????? ?????????? ?????? ????????????!',

    [lng.nickname]: '??????',
    [lng.nicknameHint]: '?????????????? 3 ??????????????',
    [lng.repeatPassword]: '?????????????????? ????????????',
    [lng.repeatPasswordHint]: '???????????? ???????????? ??????????????????',

    [lng.registerWelcome]: '?????????? ??????????????',
    [lng.registerSuccess]: '?????????????? ?????????????? ????????????!',
    [lng.registerError]: '???????????? ?????? ??????????????????????. ?????????????????? ??????????!',

    [lng.languageSelect]: '???????? ????????????????????',
    [lng.darkMode]: '???????????? ????????',
    [lng.lightMode]: '?????????????? ????????',

    [lng.userMessages]: '??????????????????',
    [lng.userPosts]: '?????? ??????????',
    [lng.userAddPost]: '???????????????? ????????',
    [lng.userNotFound]: '???????????????????????? ?? id % ???? ???????????? ???? ??????????????. ',

    [lng.settings]: '??????????????????',
    [lng.logout]: '??????????',

    [lng.uploadPhoto]: '?????????????????? ????????',
    [lng.changePhoto]: '???????????????? ????????????????????',
    [lng.deletePhoto]: '?????????????? ????????????????????',
    [lng.chooseAvatar]: '?????????????? ???????? ?????? ??????????????',
    [lng.chooseDefault]: '?????? ?????????????? ???? ????????????',

    [lng.age]: '??????????????',
    [lng.ageHint]: '?????????????? ???????????? ???????? ?????????? 0 ?? 99',
    [lng.country]: '????????????',
    [lng.countryHint]: '?????????????? 3 ??????????????',
    [lng.city]: '??????????',
    [lng.cityHint]: '?????????????? 3 ??????????????',
    [lng.firstName]: '??????',
    [lng.firstNameHint]: '?????????????? 3 ??????????????',
    [lng.lastName]: '??????????????',
    [lng.lastNameHint]: '?????????????? 3 ??????????????',
    [lng.newPassword]: '?????????? ????????????',

    [lng.update]: '????????????????',
    [lng.notFound]: '?????????????????????????? ???????????????? ???? ??????????????',
    [lng.goToHome]: '?????????????? ??????????',

    [lng.dangerZone]: '???????? ??????????????????',
    [lng.giveUpAdmin]: '???????????????????? ???? ????????',
    [lng.giveUpAdminMsg]:
      '???? ??????????????, ?????? ???????????? ???????????????????? ???? ???????? ????????????????????????????? ?????? ???????????????? ????????????????????.',
    [lng.deleteAccount]: '?????????????? ??????????????',
    [lng.deleteAccountMsg]: '???? ??????????????, ?????? ???????????? ?????????????? ?????? ??????????????? ?????? ???????????????? ????????????????????.',
    [lng.deleteAccountOtherMsg]:
      '???? ??????????????, ?????? ???????????? ?????????????? ?????????????? ?????????? ????????????????????????? ?????? ???????????????? ????????????????????.',
    [lng.upgradeRole]: '???????????????? ??????????',
    [lng.upgradeRoleMsg]: `???? ??????????????, ?????? ???????????? ???????????????? ?????????? ?????????? ????????????????????????? ?????? ???????????????? ????????????????????.`,

    [lng.confirm]: '??????????????????????',
    [lng.cancel]: '????????????????',
    [lng.close]: '??????????????',
    [lng.collapse]: '????????????????',
    [lng.expand]: '????????????????????',
    [lng.save]: '??????????????????',
    [lng.clear]: '????????????????',
    [lng.fullScreen]: '???? ???????? ??????????',
    [lng.fullScreenExit]: '???????????????? ?????????????????????????? ??????????',

    [lng.searchPlaceholder]: '??????????',
    [lng.searchWelcome]: '?????????????? ????????, ?????????? ???????????? ?????????? ??????????????????????????',
    [lng.searchNotFound]: `???????????????????????? ???? ?????????????? '%' ???? ???????? ??????????????`,

    [lng.admin]: '??????????????????????????',
    [lng.online]: '????????????',
    [lng.offline]: '??????????????',
    [lng.onlineAndMore]: '?? % ????????????',
    [lng.chat]: '??????',

    [lng.newPostTitle]: '?????????? ????????',
    [lng.editPostTitle]: '?????????????????????????? ????????',
    [lng.postTitle]: '??????????????????',
    [lng.postTitleHint]: '???????????????? ?????????????????? ??????????',
    [lng.postBody]: '????????',
    [lng.postBodyHint]: '???????????????? ???????? ??????????',
    [lng.postUploadMedia]: '?????????????????? ??????????',
    [lng.postUploadMediaDelete]: '?????????????? ??????????',

    [lng.postDelete]: '?????????????? ????????',
    [lng.postDeleteMsg]: '???? ??????????????, ?????? ???????????? ?????????????? ???????? ????????? ?????? ???????????????? ????????????????????.',

    [lng.postEdit]: '?????????????????????????? ????????',
    [lng.postCopyLink]: '?????????????????????? ????????????',
    [lng.postCopyLinkSuccess]: '???????????? ???? ???????? ???????? ?????????????????????? (%)',
    [lng.postOpen]: '?????????????? ????????',
    [lng.postNotFound]: '???????? ?? id % ???? ???????????? ???? ??????????????.',

    [lng.postTitleMsg]: '??????????',
    [lng.postGuestUser]:
      '?? ?????????? ???????????????????????? ?????? ????????????. ???????????????????????????? ???????????????? ????????, ?????????? ?????????????????? ?? ????????.',
    [lng.postSelfUser]:
      '?? ?????? ?????? ?????? ????????????. ?????????? ???????????????? ????????, ?????????????? ???? ???????????? "???????????????? ????????" ?????????? ????????????????.',

    [lng.postsAllTitle]: '?????? ??????????',
    [lng.postsAllNoneMsg]: `?????????? ???? ???????? ?????????????? ???? ??????????????. ???? ???????????? ???????????????? ?????????? ????????, ???????????? ?????????????????????????????? ?????????? ???? ???????? ???????? ?????? ???? ???????????????? ????????????????????????.`,

    [lng.commentWrite]: '???????????????? ?????? ??????????????????????...',
    [lng.commentPublish]: '??????????????????',
    [lng.commentEdit]: '???????????????? ??????????????????????',
    [lng.commentDelete]: '?????????????? ??????????????????????',
    [lng.commentsHeading]: '??????????????????????',
    [lng.commentsNoneMsg]: '?????????????????????? ?????? ?????????? ?????????? ?????? ???? ????????????????????. ???????????????? ????????????!',

    [lng.justNow]: '????????????',
    [lng.ago]: '??????????',
    [lng.minutes1]: '????????????',
    [lng.minutes2]: '????????????',
    [lng.minutes3]: '??????????',
    [lng.hours1]: '??????',
    [lng.hours2]: '??????a',
    [lng.hours3]: '??????????',
    [lng.yesterday]: '??????????',

    [lng.recording]: '????????????',
    [lng.recordingStart]: '???????????? ????????????',
    [lng.recordingStop]: '???????????????????? ????????????',
    [lng.recordingAccessing]: '???????? ???????????? ?? ??????????????????????...',
    [lng.recordingVideo]: '???????????????? ??????????',
    [lng.recordingAudio]: '???????????????? ??????????',

    [lng.loadingMsg]: '????????????????...',

    [lng.messagesHeading]: '??????????????????',
    [lng.messagesNoneMsg]:
      '?????????????????? ???? ??????????????. ???????????????????????????? ?????????????? ?????????????????????????? ???????????? ?? ???????????????? ???????????? ??????????????????.',
    [lng.messagesLastMsg]: '??????????????????',
    [lng.messagesUnread]: '??????????????????????????',
    [lng.messagesClickToChat]: '???????????? ??????',
    [lng.messageIsRead]: '??????????????????',

    [lng.chats]: '????????',
    [lng.chatWith]: '?????? ??',
    [lng.chatWrote]: '??????????????(a)',
    [lng.chatsInputEmpty]: '??????????????????',
    [lng.chatWriteMessage]: '???????????????? ??????????????????',

    [lng.formatBold]: '????????????',
    [lng.formatItalic]: '????????????',
    [lng.formatUnderline]: '??????????????????????????',
    [lng.formatTitle]: '??????????????????',
    [lng.formatBulletedList]: '?????????????????????????? ????????????',
    [lng.formatNumberedList]: '???????????????????????? ????????????',
    [lng.formatCode]: '??????',
    [lng.formatHighlight]: '???????????????? ????????????',
    [lng.formatAddLink]: '???????????????? ????????????',
    [lng.formatModifyLink]: '???????????????? ????????????',
    [lng.formatEditLinkTitle]: '?????????????????????????? ????????????',
    [lng.formatEditLinkMsg]: '?????????????? ?????????? ??????????????????????:',
    [lng.formatLinkAddress]: '??????????',

    [lng.likeFirst]: '???????????????? ???????????? ????????',
    [lng.you]: '????',
  },
};

export default LANGUAGE_DATA;
