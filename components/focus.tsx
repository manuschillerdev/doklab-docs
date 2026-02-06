"use client"

import React, { useLayoutEffect, useRef } from "react"
import {
  AnnotationHandler,
  InnerLine,
  InnerPre,
  InnerToken,
  getPreRef,
  CustomPreProps,
} from "codehike/code"
import {
  type TokenTransitionsSnapshot,
  calculateTransitions,
  getStartingSnapshot,
} from "codehike/utils/token-transitions"

const MAX_TRANSITION_DURATION = 900

// Combined Pre component with both focus scroll and smooth transitions
class SmoothPreWithFocus extends React.Component<CustomPreProps> {
  ref: React.RefObject<HTMLPreElement | null>
  firstRender: boolean = true

  constructor(props: CustomPreProps) {
    super(props)
    this.ref = getPreRef(this.props)
  }

  render() {
    return <InnerPre merge={this.props} ref={this.ref} />
  }

  getSnapshotBeforeUpdate() {
    return getStartingSnapshot(this.ref.current!)
  }

  componentDidMount() {
    this.scrollToFocus()
  }

  componentDidUpdate(
    prevProps: never,
    prevState: never,
    snapshot: TokenTransitionsSnapshot
  ) {
    // Token transitions
    const transitions = calculateTransitions(this.ref.current!, snapshot)
    transitions.forEach(({ element, keyframes, options }) => {
      const { translateX, translateY, ...kf } = keyframes as any
      if (translateX && translateY) {
        kf.translate = [
          `${translateX[0]}px ${translateY[0]}px`,
          `${translateX[1]}px ${translateY[1]}px`,
        ]
      }
      element.animate(kf, {
        duration: options.duration * MAX_TRANSITION_DURATION,
        delay: options.delay * MAX_TRANSITION_DURATION,
        easing: options.easing,
        fill: "both",
      })
    })

    // Focus scroll
    this.scrollToFocus()
  }

  scrollToFocus() {
    if (!this.ref.current) return

    const focusedElements = this.ref.current.querySelectorAll(
      "[data-focus=true]"
    ) as NodeListOf<HTMLElement>

    if (focusedElements.length === 0) return

    const containerRect = this.ref.current.getBoundingClientRect()
    let top = Infinity
    let bottom = -Infinity

    focusedElements.forEach((el) => {
      const rect = el.getBoundingClientRect()
      top = Math.min(top, rect.top - containerRect.top)
      bottom = Math.max(bottom, rect.bottom - containerRect.top)
    })

    if (bottom > containerRect.height || top < 0) {
      this.ref.current.scrollTo({
        top: this.ref.current.scrollTop + top - 10,
        behavior: this.firstRender ? "instant" : "smooth",
      })
    }
    this.firstRender = false
  }
}

export const focus: AnnotationHandler = {
  name: "focus",
  onlyIfAnnotated: true,
  PreWithRef: SmoothPreWithFocus,
  Line: (props) => (
    <InnerLine
      merge={props}
      className="px-2 opacity-50 transition-opacity duration-300"
    />
  ),
  AnnotatedLine: ({ annotation, ...props }) => (
    <InnerLine
      merge={props}
      data-focus={true}
      className="px-2 opacity-100 bg-white/5"
    />
  ),
}

export const tokenTransitions: AnnotationHandler = {
  name: "token-transitions",
  Token: (props) => (
    <InnerToken merge={props} style={{ display: "inline-block" }} />
  ),
}
