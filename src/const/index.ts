import { arrayToRecord } from "../utils";

interface DeviceInfo {
    device: string;
    scale: number;
    title: string
}
export const IOSDevices: DeviceInfo[] = [{
    device: "iOS @1x",
    scale: 1,
    title: "标准点 @1x"
}, {
    device: "iOS @2x",
    scale: 2,
    title: "视网膜 @2x"
}, {
    device: "iOS @3x",
    scale: 3,
    title: "高清视网膜 @3x"
}];

export const IOSDevicesMap: Record<string, DeviceInfo> = arrayToRecord(IOSDevices.map(d => ({
    ...d,
    device: d.device.toUpperCase()
})), "device")


const AndroidDevices: DeviceInfo[] = [{
    device: "Android MDPI",
    scale: 1,
    title: "MDPI"
}, {
    device: "Android HDPI",
    scale: 1.5,
    title: "HDPI"
}, {
    device: "Android XHDPI",
    scale: 2,
    title: "XHDPI"
}, {
    device: "Android XXHDPI",
    scale: 3,
    title: "XXHDPI"
}, {
    device: "Android XXXHDPI",
    scale: 4,
    title: "XXXHDPI"
}];

export const AndroidDevicesMap: Record<string, DeviceInfo> = arrayToRecord(AndroidDevices.map(d => ({
    ...d,
    device: d.device.toUpperCase()
})), "device")



const WebDevices = [{
    device: "Web @1x",
    scale: 1,
    title: "Web @1x",
}, {
    device: "Web @2x",
    scale: 2,
    title: "Web @2x"
}]
export const WebDevicesMap: Record<string, DeviceInfo> = arrayToRecord(WebDevices.map(d => ({
    ...d,
    device: d.device.toUpperCase()
})), "device")

export const DevicesMap  = {
    ...IOSDevicesMap,
    ...AndroidDevicesMap,
    ...WebDevicesMap
}