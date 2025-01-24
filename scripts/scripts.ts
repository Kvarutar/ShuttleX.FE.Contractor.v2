import os from 'os';
import fs from 'fs';
import child_process from 'child_process';
import { ExecArgs, FormattedCommand } from './types';

const isWin = os.platform() === 'win32';

const print = (mode: 'info' | 'error', message: string) => {
  switch (mode) {
    case 'info':
      console.log('\x1b[36m%s\x1b[0m', 'info', message);
      break;
    case 'error':
      console.error('\x1b[31m%s\x1b[0m', 'error', message);
      break;
  }
};

const prepareGoogleServices = (env: 'dev' | 'prod') => {
  const androidFileName = `google-services-${env}.json`;
  const iosFileName = `GoogleService-Info-${env}.plist`;

  print('info', `Preparing ${androidFileName} and ${iosFileName}`);

  fs.copyFileSync(`./scripts/google-services/${androidFileName}`, './android/app/google-services.json');
  fs.copyFileSync(`./scripts/google-services/${iosFileName}`, './ios/GoogleService-Info.plist');

  print('info', `${androidFileName} and ${iosFileName} successfully prepared`);
};

const exec = ({ unixCommand, winCommand, options }: ExecArgs) => {
  const formatCommand = (command: string): FormattedCommand => {
    const splittedCommand = command.split(' ');
    const executable = splittedCommand[0];
    const args = splittedCommand.slice(1);
    return { executable, args };
  };

  const formattedCommand = formatCommand(isWin ? winCommand : unixCommand);
  const additionalArgs = options?.dontParseArgs ? [] : process.argv.slice(2);
  const command = child_process.spawn(formattedCommand.executable, [...formattedCommand.args, ...additionalArgs], {
    stdio: 'inherit',
    shell: true,
  });

  command.on('close', code => code !== 0 && process.stdout.write(`child process exited with code ${code}`));
};

switch (process.env.npm_lifecycle_event) {
  case 'ios:dev':
    prepareGoogleServices('dev');
    exec({ unixCommand: "yarn react-native run-ios --scheme 'ShuttleX_Contractor_dev'", winCommand: '' });
    break;
  case 'ios:prod':
    prepareGoogleServices('prod');
    exec({ unixCommand: "yarn react-native run-ios --scheme 'ShuttleX_Contractor'", winCommand: '' });
    break;
  case 'android:dev':
    prepareGoogleServices('dev');
    exec({
      unixCommand:
        'yarn react-native run-android --mode=devdebug && adb shell am start -n com.shuttlexinc.contractor.dev/com.shuttlexinc.contractor.MainActivity',
      winCommand:
        'cmd /c "yarn react-native run-android --mode=devdebug & adb shell am start -n com.shuttlexinc.contractor.dev/com.shuttlexinc.contractor.MainActivity"',
    });
    break;
  case 'android:prod':
    prepareGoogleServices('prod');
    exec({
      unixCommand: 'yarn react-native run-android --mode=proddebug',
      winCommand: 'yarn react-native run-android --mode=proddebug',
    });
    break;
  case 'build:android:assemble:dev:debug':
    prepareGoogleServices('dev');
    exec({
      unixCommand: 'cd android && ./gradlew assembleDevDebug',
      winCommand: 'cd android & .\\gradlew assembleDevDebug',
    });
    break;
  case 'build:android:assemble:dev:release':
    prepareGoogleServices('dev');
    exec({
      unixCommand: 'cd android && ./gradlew assembleDevRelease',
      winCommand: 'cd android & .\\gradlew assembleDevRelease',
    });
    break;
  case 'build:android:assemble:prod:debug':
    prepareGoogleServices('prod');
    exec({
      unixCommand: 'cd android && ./gradlew assembleProdDebug',
      winCommand: 'cd android & .\\gradlew assembleProdDebug',
    });
    break;
  case 'build:android:assemble:prod:release':
    prepareGoogleServices('prod');
    exec({
      unixCommand: 'cd android && ./gradlew assembleProdRelease',
      winCommand: 'cd android & .\\gradlew assembleProdRelease',
    });
    break;
  case 'build:android:bundle:prod:release':
    prepareGoogleServices('prod');
    exec({
      unixCommand: 'cd android && ./gradlew bundleProdRelease',
      winCommand: 'cd android & .\\gradlew bundleProdRelease',
    });
    break;
  case 'integration-update':
    const baseCommand =
      'yarn up shuttlex-integration@git+ssh://git@github.com/DevShuttleXInc/ShuttleX.FE.Integration.v1';
    const args = process.argv.slice(2);
    if (args.length > 0) {
      exec({
        unixCommand: `${baseCommand}#${args[0]}`,
        winCommand: `${baseCommand}#${args[0]}`,
        options: { dontParseArgs: true },
      });
      break;
    }
    exec({
      unixCommand: `${baseCommand}#dev`,
      winCommand: `${baseCommand}#dev`,
      options: { dontParseArgs: true },
    });
    break;
  case 'cache-annihilator':
    print('info', 'Started clearing...');
    if (!isWin) {
      fs.rmSync(`${os.homedir()}/Library/Developer/Xcode/DerivedData`, { recursive: true, force: true });
    }
    fs.rmSync(`ios/build`, { recursive: true, force: true });
    fs.rmSync(`android/build`, { recursive: true, force: true });
    fs.rmSync(`android/app/build`, { recursive: true, force: true });
    print('info', 'All caches and build files cleared!');
    exec({
      unixCommand: 'yarn react-native clean',
      winCommand: 'yarn react-native clean',
    });
    break;
  default:
    print('error', 'unknown command');
}
