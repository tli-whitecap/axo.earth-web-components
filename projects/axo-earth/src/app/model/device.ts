import * as DeviceDetector from 'device-detector-js'

export const Device = () => {
	const deviceDetector = new DeviceDetector()
	const deviceObject = deviceDetector.parse(navigator.userAgent)
	const deviceClient = deviceObject.client
	const deviceOS = deviceObject && deviceObject.os

	return {
		os: (deviceOS && deviceOS.name) || '',
		browser:
			`${deviceOS && deviceOS.name + ':'} ${deviceClient &&
			deviceClient.name}` || ''
	}
}