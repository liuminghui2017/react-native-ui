import React, { useRef, useEffect, useState } from 'react';
import {
  StyleSheet, View, Text, Animated, Easing, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';

function Switch({
  checked,
  loading,
  defaultChecked,
  disabled,
  checkedColor,
  unCheckedColor,
  checkedChildren,
  unCheckedChildren,
  onChange,
}) {
  const [active, setActive] = useState(checked === null ? defaultChecked : checked);
  const toggleAnim = useRef(new Animated.Value(checked ? 1 : 0)).current;
  const shadowAnim = useRef(new Animated.Value(0)).current;
  const loadingAnim = useRef(new Animated.Value(0)).current;
  const firstRenderFinishRef = useRef(false);
  const lastEmitStatus = useRef(active); // 记录上一次触发onChange的状态,如果与此次状态一致则不再触发onChange事件
  const needToEmitChangeEvent = useRef(true);

  // 监听checked prop变化
  useEffect(() => {
    if (firstRenderFinishRef.current && checked !== null) {
      needToEmitChangeEvent.current = false;
      lastEmitStatus.current = checked;
      if (active !== checked) {
        setActive(checked);
      }
    }
  }, [checked]);

  // 状态变化动画控制
  useEffect(() => {
    if (firstRenderFinishRef.current) {
      Animated.timing(toggleAnim, {
        toValue: active ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          if (needToEmitChangeEvent.current && lastEmitStatus.current !== active) {
            lastEmitStatus.current = active;
            onChange && onChange(active);
          }
        }
      });
    } else {
      // 初始化状态时不需要动画
      toggleAnim.setValue(active ? 1 : 0);
    }
  }, [active]);

  // loading动画控制
  useEffect(() => {
    if (loading) {
      const spin = Animated.timing(loadingAnim, {
        toValue: 360,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
        isInteraction: false,
      });
      Animated.loop(spin).start();
    } else {
      loadingAnim.stopAnimation();
      loadingAnim.setValue(0);
    }
    return () => loadingAnim.stopAnimation();
  }, [loading]);

  useEffect(() => {
    firstRenderFinishRef.current = true;
  }, []);

  // 切换状态
  function toggle() {
    needToEmitChangeEvent.current = true;
    setActive((prevState) => !prevState);
    shadowAnim.stopAnimation();
    shadowAnim.setValue(0);
    Animated.timing(shadowAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={toggle}
      hitSlop={{
        top: 8, left: 8, right: 8, bottom: 8,
      }}
      disabled={disabled || loading}
      style={{
        opacity: disabled ? 0.7 : 1,
      }}
    >
      <View style={styles.container}>
        <View style={styles.shadowWrap}>
          <Animated.View
            style={[
              styles.shadow,
              {
                opacity: shadowAnim.interpolate({
                  inputRange: [0, 0.2, 1],
                  outputRange: [0, 1, 0],
                }),
                transform: [{
                  scale: shadowAnim.interpolate({
                    inputRange: [0, 0.2, 1],
                    outputRange: [1, 1.2, 1.2],
                  }),
                }],
              },
            ]}
          />
        </View>

        <View style={styles.panelWrap}>
          <Animated.View
            style={[
              styles.panel,
              {
                backgroundColor: unCheckedColor,
                opacity: toggleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0],
                }),
              },
            ]}
          />

          <Animated.View
            style={[
              styles.panel,
              {
                backgroundColor: checkedColor,
                opacity: toggleAnim,
              },
            ]}
          />

          <View style={[styles.panel, styles.checkLabelPanel]}>
            <View style={styles.checkLabel}>
              <Text style={[styles.checkLabelText, { opacity: active ? 1 : 0 }]}>{checkedChildren}</Text>
            </View>
            <View style={styles.checkLabel}>
              <Text style={[styles.checkLabelText, { opacity: active ? 0 : 1 }]}>{unCheckedChildren}</Text>
            </View>
          </View>

          <Animated.View
            style={{
              transform: [{
                translateX: toggleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 20],
                }),
              }],
            }}
          >
            <View style={styles.handler}>
              <Animated.View
                style={{
                  opacity: loading ? 1 : 0,
                  transform: [{
                    rotateZ: loadingAnim.interpolate({
                      inputRange: [0, 360],
                      outputRange: ['0deg', '360deg'],
                    }),
                  }],
                }}
              >
                <Svg
                  width="16"
                  height="16"
                >
                  <Path
                    d="M 8,3 Q 13,3 13,8"
                    fill="none"
                    stroke={checkedColor}
                    strokeWidth="1"
                  />
                </Svg>
              </Animated.View>
            </View>
          </Animated.View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

Switch.propTypes = {
  checked: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  checkedColor: PropTypes.string,
  unCheckedColor: PropTypes.string,
  checkedChildren: PropTypes.string,
  unCheckedChildren: PropTypes.string,
  onChange: PropTypes.func,
};

Switch.defaultProps = {
  checked: null,
  defaultChecked: false,
  disabled: false,
  loading: false,
  checkedColor: 'rgb(37,147,252)',
  unCheckedColor: 'rgb(191,191,191)',
  checkedChildren: '',
  unCheckedChildren: '',
  onChange: null,
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 20,
  },
  shadowWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  shadow: {
    flex: 1,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  panelWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  panel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
  },
  checkLabelPanel: {
    flexDirection: 'row',
  },
  checkLabel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkLabelText: {
    fontSize: 10,
    color: '#ffffff',
    includeFontPadding: false,
  },
  handler: {
    width: 16,
    height: 16,
    margin: 2,
    borderRadius: 8,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#ffffff',
  },
});

export default Switch;
