# Goblin Sax Loan Widget


A loan widget wirtten in React and Typescript that utilizes the [Goblin Sax SDK](https://github.com/GoblinSax/gs-sdk) to provide instant loan on whitelisted NFTs. The widget is implemented in React and meant to used as a React component. The widget requires Goblin Sax API Key. [Contact Us](https://discord.com/invite/GS6rvrvb9B) if you don't have it.

The widget comes with default light mode, but can configure to dark mode.
The widget is responsive by container query, and can be used on small screens and large screens.
The action color can also be configured. The default action color is green.

## Widget Images
#### Light Mode
![](https://i.ibb.co/XZb33JT/GS-Loan-Widget.png)

#### Dark Mode
![](https://i.ibb.co/WV1SSjt/GS-Loan-Widget-Dark-Mode.png)

#### Custom Blue Color
![](https://i.ibb.co/HHW1z3v/GS-Loan-Widget-Blue.png)

## Links
[npm](https://www.npmjs.com/package/@goblinsax/loan-widget)

## Install
> npm i @goblinsax/loan-widget

## Example

[Demo](https://loan-widget-example.vercel.app/) <br />
[Demo Github](https://github.com/GoblinSax/loan-widget-example)


## Getting Started

    import { Loans } from "@goblinsax/loan-widget";
    <Loans lightOrDark={'light'} mainColor={"#00D092"} signer={signer} GS_API_KEY={GS_API_KEY}/>

## Props

| Prop | Type | Description |
| --- | --- | --- |
| lightOrDark | string | 'light' or 'dark' |
| mainColor | string | hex color code |
| signer | string | signer from ethers |
| GS_API_KEY | string | Goblin Sax API Key |

	

