
在开始我们编写 Jetpack Compose 的软件时，我们需要 

1. 一台可以 **联网** 的电脑
2. **安装** [最新 Canary 版的 Android Studio 预览版](https://developer.android.com/studio/preview)
3. 选择创建 **Empty Compose Activity** [![c3JfgA.md.png](https://z3.ax1x.com/2021/04/07/c3JfgA.png)](https://z3.ax1x.com/2021/04/07/c3JfgA.png)

4. 配置 Kotlin
```
    plugins {
        id 'org.jetbrains.kotlin.android' version '1.4.30'
    }
```

5. 配置 Gradle

您需要将应用的最低 API 级别设置为 21 或更高级别，并在应用的 build.gradle 文件中启用 Jetpack Compose，如下所示。另外还要设置 Kotlin 编译器插件的版本。

```
    android {
        defaultConfig {
            ...
            minSdkVersion 21
        }

        buildFeatures {
            // Enables Jetpack Compose for this module
            compose true
        }
        ...

        // Set both the Java and Kotlin compilers to target Java 8.

        compileOptions {
            sourceCompatibility JavaVersion.VERSION_1_8
            targetCompatibility JavaVersion.VERSION_1_8
        }

        kotlinOptions {
            jvmTarget = "1.8"
        }

        composeOptions {
            kotlinCompilerExtensionVersion '1.0.0-beta01'
        }
    }
```

添加 Jetpack Compose 工具包的依赖项

```
    dependencies {
        implementation 'androidx.compose.ui:ui:1.0.0-beta01'
        // Tooling support (Previews, etc.)
        implementation 'androidx.compose.ui:ui-tooling:1.0.0-beta01'
        // Foundation (Border, Background, Box, Image, Scroll, shapes, animations, etc.)
        implementation 'androidx.compose.foundation:foundation:1.0.0-beta01'
        // Material Design
        implementation 'androidx.compose.material:material:1.0.0-beta01'
        // Material design icons
        implementation 'androidx.compose.material:material-icons-core:1.0.0-beta01'
        implementation 'androidx.compose.material:material-icons-extended:1.0.0-beta01'
        // Integration with activities
        implementation 'androidx.activity:activity-compose:1.3.0-alpha03'
        // Integration with ViewModels
        implementation 'androidx.lifecycle:lifecycle-viewmodel-compose:1.0.0-alpha02'
        // Integration with observables
        implementation 'androidx.compose.runtime:runtime-livedata:1.0.0-beta01'
        implementation 'androidx.compose.runtime:runtime-rxjava2:1.0.0-beta01'

        // UI Tests
        androidTestImplementation 'androidx.compose.ui:ui-test-junit4:1.0.0-beta01'
    }
```