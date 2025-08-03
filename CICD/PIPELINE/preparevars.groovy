def globalVariable(envName){
    // !!!!----------------------------------------!!!! //
    // !!!!------------- Start to edit ------------!!!! //
    // !!!!----------------------------------------!!!! //
    env.project_group       = "do68004-djn"
    env.project_name        = "fe-djoin-backend"
    env.project_version     = "1.0.0"

    env.git_group_slug      = ""
    env.git_project_slug    = ""

    env.application_language    = [ "python": false, "nodejs": true, "golang": false, "dotnet_core": false, "java": false, "php": false, "dotnet_fw": false, "nodejs_with_yarn": false ]
    env.deploy_type             = [ "oc": false, "aks": false, "aws": false, "azure_function": false, "appservice_srccode": true, "appservice_container": false ]
    env.unit_test_base_image    = "node:23-alpine"
    env.automate_test           = [ "api_test" : false, "ui_test" : false ]
    env.allow_failure           = [ "trivy" : true, "sonarqube" : true, "blackduck" : true, "owasp" : true, "owasp_zap"  : true , "coverity" : true , "performance_test" : true, "api_test" : true, "ui_test" : true]
    env.build_cmd               = "npm run build"
    env.coverityID              = "user5"
    env.blkduckID               = "user5"
    env.skip_stage              = [ "unit_test": true, "quality_analysis": true, "sca_black_duck": false, "sast_coverity": false, "image_scan_trivy": true, "dast_owasp_zap": true, "performance_test": true, "health_check_dev": true, "automate_test_dev": true, "health_check_sit": true, "automate_test_sit": true, "health_check_uat": true, "automate_test_uat": true, "health_check_prd": true]
    env.image_regitry_server    = [ "acr": false, "nexus": false, "ecr": false, "gar": false, "gcr": false ]
    env.container_os_platform   = [ "windows": false, "linux": true ]
    env.is_scan_src_code_only   = true
    env.is_build_with_internal_net = false
    env.time_sleep_before_health_check = 0
    env.coverity_exclude_path   = ""
    env.is_multi_cluster_deployment = false

    // NPM Private Registry
    env.has_npm_private_reg     = false
    env.npm_private_reg_path    = ""
    env.npm_private_reg_token   = "${project_group}-npm-registry"

    // DEV
    url_env_1 = "https://join.pttdigital.com/"
    url_root_path_env_1 = "/"
    url_health_check_path_env_1 = "/"
    // SIT
    url_env_2 = "https://join.pttdigital.com/"
    url_root_path_env_2 = "/"
    url_health_check_path_env_2 = "/"
    // UAT
    url_env_3 = "https://join.pttdigital.com/"
    url_root_path_env_3 = "/"
    url_health_check_path_env_3 = "/"
    // PRD
    url_env_4 = "https://join.pttdigital.com/"
    url_root_path_env_4 = "/"
    url_health_check_path_env_4 = "/"

     //! Azure Container Registry //
    acr_credentials_cicd      = "${project_group}-asp"
    // DEV
    acr_server_env_1          = "djoin.azurecr.io"    // edit # name of 'Login server' in container registry
    // SIT
    acr_server_env_2          = "djoin.azurecr.io"    // edit # name of 'Login server' in container registry
    // UAT
    acr_server_env_3          = "djoin.azurecr.io"    // edit # name of 'Login server' in container registry
    // PRD
    acr_server_env_4          = "djoin.azurecr.io"    // edit # name of 'Login server' in container registry
    //! End Azure Container Registry //
    

    // Azure Config //
    //! App Service Config //
    app_service_credentials_cicd      = "${project_group}-asp"
    // DEV
    app_service_name_env_1    = ""      // edit # App Service Name
    app_service_rg_env_1      = ""      // edit # Resource Group Name of App Service
    // SIT
    app_service_name_env_2    = ""      // edit # App Service Name
    app_service_rg_env_2      = ""      // edit # Resource Group Name of App Service
    // UAT
    app_service_name_env_3    = ""      // edit # App Service Name
    app_service_rg_env_3      = ""      // edit # Resource Group Name of App Service
    // PRD
    app_service_name_env_4    = ""      // edit # App Service Production Name
    app_service_rg_env_4      = ""      // edit # Resource Group Name of App Service
    // COMMON
    env.app_container_port    = 0    // edit # App Service Port

    // !!!!----------------------------------------!!!! //
    // !!!!-------------- End to edit -------------!!!! //
    // !!!!----------------------------------------!!!! //

    // !!!!----------------------------------------!!!! //
    // !!!!-------------- Do not edit -------------!!!! //
    // !!!!----------------------------------------!!!! //

    //! Azure key vault Config // 
    env.keyVault_url        = "https://kv-pdsdevsecops-prd-001.vault.azure.net/"
    env.keyVault_credential = "vault-creds-for-jenkins-dgt"
    //! End Azure key vault Config //

    env.cicd_env_1 = "dev"
    env.cicd_env_2 = "sit"
    env.cicd_env_3 = "uat"
    env.cicd_env_4 = "prd"

    switch (env.BRANCH_NAME) {

        case "develop":
        case "hotfix":
            switch (envName) {
                case cicd_env_1 :
                    env.envName                   = cicd_env_1
                    // App Service
                    env.app_service_credentials    = "${app_service_credentials_cicd}-${envName}"
                    env.app_service_name          = app_service_name_env_1
                    env.app_service_rg            = app_service_rg_env_1
                    // IMAGE
                    env.image_repo_server         = acr_server_env_1
                    env.image_credentials         = "${acr_credentials_cicd}/${cicd_env_1}"
                    env.image_name                = "${env.image_repo_server}/${project_group}/${project_name}"
                    // APP
                    env.url_application           = url_env_1
                    env.url_root_path             = url_root_path_env_1
                    env.url_health_check_path     = url_health_check_path_env_1
                    break
                case cicd_env_2:
                    env.envName = cicd_env_2
                    // App Service
                    env.app_service_credentials    = "${app_service_credentials_cicd}-${envName}"
                    env.app_service_name          = app_service_name_env_2
                    env.app_service_rg            = app_service_rg_env_2
                    // IMAGE
                    env.image_prev_repo_server    = acr_server_env_1
                    env.image_prev_credentials    = "${acr_credentials_cicd}/${cicd_env_1}"
                    env.image_repo_server         = acr_server_env_2
                    env.image_credentials         = "${acr_credentials_cicd}/${cicd_env_2}"
                    env.image_prev_name           = "${env.image_prev_repo_server}/${project_group}/${project_name}"
                    env.image_name                = "${env.image_repo_server}/${project_group}/${project_name}"
                    // APP
                    env.url_application           = url_env_2
                    env.url_root_path             = url_root_path_env_2
                    env.url_health_check_path     = url_health_check_path_env_2
                    break
            }
        case "hotfix":
        case "hotfix-deploy":
        case "master":
        case "main":
            switch (envName) {
                case cicd_env_3:
                    env.envName = cicd_env_3
                    // App Service
                    env.app_service_credentials    = "${app_service_credentials_cicd}-${envName}"
                    env.app_service_name          = app_service_name_env_3
                    env.app_service_rg            = app_service_rg_env_3
                    // IMAGE
                    env.image_prev_repo_server    = acr_server_env_2
                    env.image_prev_credentials    = "${acr_credentials_cicd}/${cicd_env_2}"
                    env.image_repo_server         = acr_server_env_3
                    env.image_credentials         = "${acr_credentials_cicd}/${cicd_env_3}"
                    env.image_prev_name           = "${env.image_prev_repo_server}/${project_group}/${project_name}"
                    env.image_name                = "${env.image_repo_server}/${project_group}/${project_name}"
                    // APP
                    env.url_application           = url_env_3
                    env.url_root_path             = url_root_path_env_3
                    env.url_health_check_path     = url_health_check_path_env_3
                    break
                case cicd_env_4:
                    env.envName = cicd_env_4
                    // App Service
                    env.app_service_credentials    = "${app_service_credentials_cicd}-${envName}"
                    env.app_service_name        = app_service_name_env_4
                    env.app_service_rg            = app_service_rg_env_4
                    // IMAGE
                    env.image_prev_repo_server    = acr_server_env_3
                    env.image_prev_credentials    = "${acr_credentials_cicd}/${cicd_env_3}"
                    env.image_repo_server         = acr_server_env_4
                    env.image_credentials         = "${acr_credentials_cicd}/${cicd_env_4}"
                    env.image_prev_name           = "${env.image_prev_repo_server}/${project_group}/${project_name}"
                    env.image_name                = "${env.image_repo_server}/${project_group}/${project_name}"
                    // APP
                    env.url_application           = url_env_4
                    env.url_root_path             = url_root_path_env_4
                    env.url_health_check_path     = url_health_check_path_env_4
                    break
            }
    }
}

return this
