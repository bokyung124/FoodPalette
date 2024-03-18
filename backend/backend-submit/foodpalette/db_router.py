class AnalyticsRouter:
    """
    라우터는 'analytics' 앱의 모델에 대해 'analytics' 데이터베이스를,
    그 외의 모든 앱에 대해서는 'default' 데이터베이스를 사용하도록 지정합니다.
    """

    def db_for_read(self, model, **hints):
        """
        'analytics' 앱의 모델에 대한 읽기 작업을 'analytics' 데이터베이스로 라우팅합니다.
        """
        if model._meta.app_label == 'analytics':
            return 'analytics'
        return 'default'

    def db_for_write(self, model, **hints):
        """
        'analytics' 앱의 모델에 대한 쓰기 작업을 'analytics' 데이터베이스로 라우팅합니다.
        """
        if model._meta.app_label == 'analytics':
            return 'analytics'
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        """
        'analytics' 앱과 'default' 앱 간의 관계를 허용하지 않습니다.
        """
        if obj1._meta.app_label == 'analytics' or \
           obj2._meta.app_label == 'analytics':
            return False
        return True

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        'analytics' 앱의 모델 마이그레이션은 'analytics' 데이터베이스에만 허용합니다.
        """
        if app_label == 'analytics':
            return db == 'analytics'
        return db == 'default'
