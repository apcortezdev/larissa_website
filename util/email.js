export async function sendNewUserEmail(user, tempPassword) {
  return false;
}

export async function sendProjectNotificationEmail(user, notification) {
  return false;
}

export async function sendRecoveryEmail(user) {
  console.log(
    'URL: www.lpaschoalotto.com.br/recovery/' +
      user._id +
      '/' +
      user.recoveryLogs[user.recoveryLogs.length - 1].recoveryToken
  );
  return true;
}
